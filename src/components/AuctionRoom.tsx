'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { INITIAL_AUCTIONS, INITIAL_BIDS } from '@/lib/mockData';
import { Auction, BidRecord } from '@/types/auction';
import { createClient } from '@/lib/supabase/client';
import DepositModal from '@/components/DepositModal';
import {
  Gavel,
  ShieldCheck,
  Clock,
  Flame,
  ArrowLeft,
  User,
  Zap,
  TrendingUp,
  Share2,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuctionRoomProps {
  auctionId: string;
}

export default function AuctionRoom({ auctionId }: AuctionRoomProps) {
  const defaultAuction =
    INITIAL_AUCTIONS.find((a) => a.id === auctionId) || INITIAL_AUCTIONS[0];

  const [auction, setAuction] = useState<Auction>(defaultAuction);
  const [bids, setBids] = useState<BidRecord[]>(INITIAL_BIDS[auctionId] || []);
  const [customBidAmount, setCustomBidAmount] = useState<number>(
    defaultAuction.current_price + defaultAuction.min_increment
  );
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0, totalSec: 0 });
  const [isExtendedAlert, setIsExtendedAlert] = useState(false);
  const [pricePulse, setPricePulse] = useState(false);
  const [isDepositAuthorized, setIsDepositAuthorized] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const end = new Date(auction.end_at).getTime();
      const diff = Math.max(0, end - now);
      const totalSec = Math.floor(diff / 1000);

      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ minutes: m, seconds: s, totalSec });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [auction.end_at]);

  useEffect(() => {
    setCustomBidAmount(auction.current_price + auction.min_increment);
  }, [auction.current_price, auction.min_increment]);

  useEffect(() => {
    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`auction-room-${auctionId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'auctions',
            filter: `id=eq.${auctionId}`,
          },
          (payload) => {
            const updated = payload.new as Auction;
            setAuction(updated);
            triggerPriceUpdateEffect();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Offline fallback
    }
  }, [auctionId]);

  const triggerPriceUpdateEffect = () => {
    setPricePulse(true);
    setTimeout(() => setPricePulse(false), 800);
  };

  const handlePlaceBid = (amount: number) => {
    if (!isDepositAuthorized) {
      setShowDepositModal(true);
      return;
    }

    if (amount < auction.current_price + auction.min_increment) {
      setFeedbackMessage(`出價需高於 NT$ ${(auction.current_price + auction.min_increment).toLocaleString()}`);
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    let newEndAt = auction.end_at;
    let didExtend = false;
    if (timeLeft.totalSec <= auction.anti_snipe_trigger_sec) {
      const extendedTime = new Date(new Date(auction.end_at).getTime() + auction.anti_snipe_extend_sec * 1000);
      newEndAt = extendedTime.toISOString();
      didExtend = true;
      setIsExtendedAlert(true);
      setTimeout(() => setIsExtendedAlert(false), 5000);
    }

    const newBid: BidRecord = {
      id: `bid-${Date.now()}`,
      auction_id: auction.id,
      bidder_id: 'user-current-you',
      bidder_name: '您 (Jimmy)',
      bidder_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      amount: amount,
      created_at: new Date().toISOString(),
    };

    setAuction((prev) => ({
      ...prev,
      current_price: amount,
      current_winner_id: 'user-current-you',
      current_winner_name: '您 (Jimmy)',
      end_at: newEndAt,
    }));

    setBids((prev) => [newBid, ...prev]);
    triggerPriceUpdateEffect();

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#0082FB', '#D4F652', '#0f172a'],
    });

    setFeedbackMessage(
      didExtend
        ? `🎉 出價 NT$ ${amount.toLocaleString()} 成功！觸發防壓秒保護，結標時間延長 +2 分鐘！`
        : `🎉 出價 NT$ ${amount.toLocaleString()} 成功！您目前暫居最高標！`
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const isUrgent = timeLeft.totalSec <= 120 && timeLeft.totalSec > 0;

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-slate-900 pb-20 antialiased">
      {/* Top Floating Glass Navigation */}
      <div className="bg-[#0082FB] text-white py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回拍賣大廳</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white text-slate-900 font-extrabold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#0082FB] animate-pulse"></span>
              即時競標進行中
            </span>
            <button className="p-1.5 rounded-full text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Snipe Trigger Banner */}
      {isExtendedAlert && (
        <div className="bg-[#D4F652] text-slate-950 px-4 py-2.5 text-center text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md animate-bounce">
          <Zap className="w-4 h-4 stroke-[2.5]" />
          <span>⚡ 防壓秒延長機制已觸發！為杜絕機器人最後一秒搶標，結標倒數自動延長 120 秒！</span>
        </div>
      )}

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-6 h-6 rounded-full bg-[#D4F652] text-slate-950 flex items-center justify-center font-bold shrink-0">
            ✓
          </div>
          <span className="font-medium">{feedbackMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-[32px] overflow-hidden bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50">
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-100">
                <img
                  src={auction.images[0]}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Description Card */}
            <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-[#0082FB]">
                  {auction.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D4F652] text-slate-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 需圈存 NT$ {auction.deposit_required.toLocaleString()}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-slate-900 mt-4 leading-snug">
                {auction.title}
              </h1>

              <p className="mt-4 text-sm text-slate-600 leading-relaxed font-normal">
                {auction.description}
              </p>

              {/* Seller Trust Box */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-slate-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0082FB] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    優
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{auction.seller_name}</div>
                    <div className="text-slate-500 font-medium">履約好評 ★ {auction.seller_rating} / 5.0</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-900 text-sm">買賣雙方履約信託</div>
                    <div className="text-emerald-700 font-medium">得標棄標即扣保證金補償賣家</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Bidding Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-2xl shadow-sky-500/5 relative overflow-hidden">
              {/* Countdown Bar */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#0082FB]" />
                  距離結標時間
                </span>
                <div
                  className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                    isUrgent
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  {isUrgent && <Flame className="w-3.5 h-3.5 text-amber-300" />}
                  <span>
                    {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Price Ticker */}
              <div className="mt-6">
                <div className="text-xs text-slate-400 font-semibold flex items-center justify-between uppercase tracking-wider">
                  <span>當前最高出價</span>
                  <span className="text-[#0082FB] font-bold text-xs flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> 毫秒級跳價
                  </span>
                </div>

                <div
                  className={`mt-1 text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 transition-transform duration-300 ${
                    pricePulse ? 'scale-105 text-[#0082FB]' : ''
                  }`}
                >
                  NT$ {auction.current_price.toLocaleString()}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span>當前領先者：</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    {auction.current_winner_name || '尚無出價'}
                  </span>
                </div>
              </div>

              {/* Deposit Guarantee Box */}
              <div className="mt-6 p-5 rounded-2xl bg-[#F9FAFB] border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        isDepositAuthorized ? 'text-emerald-500' : 'text-[#0082FB]'
                      }`}
                    />
                    <span className="font-bold text-slate-900">
                      防惡意棄標保證金
                    </span>
                  </div>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                      isDepositAuthorized
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-[#D4F652] text-slate-950'
                    }`}
                  >
                    {isDepositAuthorized ? '已完成預授權' : '出價前需圈存'}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-500 leading-relaxed font-medium">
                  圈存 NT$ {auction.deposit_required.toLocaleString()}，未得標自動解圈。得標 24 小時未付款則沒收 80% 補償受害賣家。
                </p>

                {!isDepositAuthorized && (
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-extrabold bg-[#0082FB] hover:bg-[#0070df] text-white transition-all shadow-md shadow-sky-500/20 active:scale-95"
                  >
                    立即預授權開通出價權限
                  </button>
                )}
              </div>

              {/* Quick Bid Ladders */}
              <div className="mt-6 space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  一鍵快速加價 (每次最低 +NT$ {auction.min_increment})
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[auction.min_increment, auction.min_increment * 5, auction.min_increment * 10].map((inc) => (
                    <button
                      key={inc}
                      onClick={() => handlePlaceBid(auction.current_price + inc)}
                      className="py-3 px-2 rounded-2xl bg-slate-100 hover:bg-[#D4F652] hover:text-slate-950 text-slate-900 active:scale-95 transition-all text-xs font-mono font-black border border-slate-200/80 flex flex-col items-center shadow-sm"
                    >
                      <span>+NT$ {inc.toLocaleString()}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Bid Input */}
                <div className="pt-2 flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-3 text-xs font-mono font-bold text-slate-400">NT$</span>
                    <input
                      type="number"
                      step={auction.min_increment}
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                      className="w-full bg-[#F9FAFB] border border-slate-200 rounded-2xl py-3 pl-11 pr-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0082FB] transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => handlePlaceBid(customBidAmount)}
                    className="py-3 px-6 rounded-2xl font-black text-xs sm:text-sm bg-[#D4F652] hover:bg-[#c4e83f] text-slate-950 shadow-md shadow-lime-500/20 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Gavel className="w-4 h-4 stroke-[2.5]" />
                    <span>確認出價</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Bid History */}
            <div className="p-8 rounded-[32px] bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  出價歷史紀錄 ({bids.length} 筆)
                </span>
                <span className="text-[11px] text-slate-400 font-medium">毫秒即時更新</span>
              </div>

              <div className="mt-4 space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {bids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`p-3.5 rounded-2xl flex items-center justify-between text-xs transition-colors ${
                      index === 0
                        ? 'bg-sky-50 border border-sky-100 text-slate-900'
                        : 'bg-[#F9FAFB] border border-slate-100 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={bid.bidder_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={bid.bidder_name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {bid.bidder_name}
                          {index === 0 && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#D4F652] text-slate-950 font-black">
                              最高標
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(bid.created_at).toLocaleTimeString('zh-TW')}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono font-black text-sm text-[#0082FB]">
                      NT$ {bid.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={showDepositModal}
        depositAmount={auction.deposit_required}
        onClose={() => setShowDepositModal(false)}
        onConfirm={() => {
          setIsDepositAuthorized(true);
          setShowDepositModal(false);
          setFeedbackMessage('✅ 信用卡預授權保證金完成！已開通本場出價權限。');
          setTimeout(() => setFeedbackMessage(null), 3000);
        }}
      />
    </div>
  );
}
