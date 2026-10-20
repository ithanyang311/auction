-- ==============================================================================
-- 現代化即時競價平台 (NextGen Auction) - Supabase 完整架構 SQL
-- 包含：資料表、RLS 安全原則、防超標與防壓秒原子預存函數 (PL/pgSQL)、即時廣播設定
-- ==============================================================================

-- 1. 會員設定檔 (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  line_user_id TEXT,
  phone TEXT,
  nickname TEXT NOT NULL,
  avatar_url TEXT,
  credit_score INT DEFAULT 100,      -- 履約信用分 (預設 100)
  default_count INT DEFAULT 0,       -- 惡意棄標次數
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 拍賣品主表 (Auctions)
CREATE TABLE IF NOT EXISTS public.auctions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  category TEXT DEFAULT 'general',
  starting_price INT NOT NULL,             -- 起標價 (NTD)
  reserve_price INT DEFAULT 0,             -- 保留底價 (0為無底價)
  min_increment INT DEFAULT 100,           -- 每次最低加價
  current_price INT NOT NULL,              -- 當前最高出價
  current_winner_id UUID REFERENCES public.profiles(id),
  deposit_required INT DEFAULT 500,        -- 本場拍賣需預授權之保證金 (NTD)
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'ended', 'settled', 'canceled')),
  
  -- 防壓秒延長規則 (結標前 N 秒內出價，自動延長 N 秒)
  anti_snipe_trigger_sec INT DEFAULT 120,
  anti_snipe_extend_sec INT DEFAULT 120,
  
  start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_at TIMESTAMPTZ NOT NULL,             -- 結標時間 (受防壓秒動態延長)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 出價歷史表 (Bids)
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 信用卡預授權保證金表 (Deposits) - 防惡意棄標核心
CREATE TABLE IF NOT EXISTS public.deposits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  auction_id UUID REFERENCES public.auctions(id) NOT NULL,
  auth_code TEXT NOT NULL,                 -- 金流回傳交易授權碼 (TapPay/Stripe Auth Code)
  amount INT NOT NULL,                     -- 圈存額度
  status TEXT DEFAULT 'authorized' CHECK (status IN ('authorized', 'released', 'captured', 'forfeited')),
  -- authorized: 圈存中 / released: 已解圈 (未得標) / captured: 轉為得標訂金 / forfeited: 棄標沒收
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 得標訂單表 (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES public.auctions(id) NOT NULL UNIQUE,
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  final_price INT NOT NULL,
  deposit_deducted INT DEFAULT 0,
  payment_deadline TIMESTAMPTZ NOT NULL,   -- 得標後 24 小時結帳期限
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'defaulted', 'runner_up_taken')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 核心邏輯：防超標與「防壓秒延長」原子預存函數 (PL/pgSQL)
-- ==============================================================================
CREATE OR REPLACE FUNCTION place_bid(
  p_auction_id UUID,
  p_bidder_id UUID,
  p_amount INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_auction RECORD;
  v_now TIMESTAMPTZ := NOW();
  v_new_end_at TIMESTAMPTZ;
  v_extended BOOLEAN := FALSE;
BEGIN
  -- 1. 行級排他鎖 (FOR UPDATE) 杜絕併發超標
  SELECT * INTO v_auction
  FROM public.auctions
  WHERE id = p_auction_id
  FOR UPDATE;

  -- 2. 拍賣狀態檢核
  IF v_auction.status != 'active' THEN
    RAISE EXCEPTION '拍賣未處於進行中狀態';
  END IF;

  IF v_now >= v_auction.end_at THEN
    RAISE EXCEPTION '拍賣已結束';
  END IF;

  -- 3. 金額檢核 (不得低於目前最高價 + 最低級距)
  IF p_amount < (v_auction.current_price + v_auction.min_increment) THEN
    RAISE EXCEPTION '出價過低，最低有效出價為 NT$ %', (v_auction.current_price + v_auction.min_increment);
  END IF;

  -- 4. 防壓秒延長 (Anti-Sniping) 判定
  IF (v_auction.end_at - v_now) <= (v_auction.anti_snipe_trigger_sec || ' seconds')::INTERVAL THEN
    v_new_end_at := v_auction.end_at + (v_auction.anti_snipe_extend_sec || ' seconds')::INTERVAL;
    v_extended := TRUE;
  ELSE
    v_new_end_at := v_auction.end_at;
  END IF;

  -- 5. 更新拍賣主表
  UPDATE public.auctions
  SET 
    current_price = p_amount,
    current_winner_id = p_bidder_id,
    end_at = v_new_end_at
  WHERE id = p_auction_id;

  -- 6. 記錄出價歷史
  INSERT INTO public.bids (auction_id, bidder_id, amount, created_at)
  VALUES (p_auction_id, p_bidder_id, p_amount, v_now);

  -- 7. 回傳結果
  RETURN jsonb_build_object(
    'success', true,
    'current_price', p_amount,
    'end_at', v_new_end_at,
    'extended', v_extended
  );
END;
$$;

-- ==============================================================================
-- 啟用 Supabase Realtime 即時廣播
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;

-- ==============================================================================
-- 啟用 Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;

-- 任何人可公開讀取拍賣品與出價紀錄
CREATE POLICY "Allow public read on auctions" ON public.auctions FOR SELECT USING (true);
CREATE POLICY "Allow public read on bids" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);

-- 只有本人可查看自己的保證金預授權紀錄
CREATE POLICY "Users can view own deposits" ON public.deposits FOR SELECT USING (auth.uid() = user_id);
