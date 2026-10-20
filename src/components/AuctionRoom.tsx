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
  Share2
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
      bidder_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jimmy',
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
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#f59e0b', '#f43f5e'],
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
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Banner Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回拍賣大廳</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              即時競標大廳
            </span>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {isExtendedAlert && (
        <div className="bg-gradient-to-r from-amber-600 to-rose-600 text-white px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-bounce">
          <Zap className="w-4 h-4" />
          <span>⚡ 防壓秒延長機制已觸發！為杜絕最後一秒機器人搶標，結標倒數自動延長 120 秒！</span>
        </div>
      )}

      {feedbackMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Showcase */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
              <div className="aspect-[16/10] relative overflow-hidden bg-slate-950">
                <img
                  src={auction.images[0]}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                {auction.title}
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {auction.description}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold">
                    賣
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{auction.seller_name}</div>
                    <div className="text-slate-400">履約評分 ★ {auction.seller_rating} / 5.0</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-emerald-300">第三方信託履約保證</div>
                    <div className="text-slate-400">買家驗貨無誤後才撥款給賣家</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Realtime Bidding Console */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  結標倒數計時
                </span>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
                    isUrgent
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                      : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {isUrgent && <Flame className="w-3.5 h-3.5 text-rose-400" />}
                  <span>
                    {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>當前最高出價 (Current Highest Bid)</span>
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> 毫秒級即時同步
                  </span>
                </div>

                <div
                  className={`mt-1 text-4xl sm:text-5xl font-black font-mono tracking-tight transition-transform duration-300 ${
                    pricePulse
                      ? 'scale-105 text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  NT$ {auction.current_price.toLocaleString()}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <span>最高標得主：</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-400" />
                    {auction.current_winner_name || '尚無出價'}
                  </span>
                </div>
              </div>

              {/* Deposit Guarantee Status Box */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        isDepositAuthorized ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    />
                    <span className="font-semibold text-slate-200">
                      防惡意棄標保證金
                    </span>
                  </div>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isDepositAuthorized
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {isDepositAuthorized ? '已預授權 NT$ 500' : '出價前需圈存'}
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 leading-normal">
                  出價前圈存 NT$ {auction.deposit_required.toLocaleString()}，未得標自動解除圈存。得標者若逾期未付款，沒收保證金補償賣家。
                </p>
                {!isDepositAuthorized && (
                  <button
                    onClick={() => setShowDepositModal(true)}
                    className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-colors"
                  >
                    立即完成保證金預授權 (開通出價)
                  </button>
                )}
              </div>

              {/* Bidding Action Center */}
              <div className="mt-6 space-y-3">
                <div className="text-xs text-slate-400">快捷加價梯隊 (最低加價 +NT$ {auction.min_increment})</div>
                <div className="grid grid-cols-3 gap-2">
                  {[auction.min_increment, auction.min_increment * 5, auction.min_increment * 10].map((inc) => (
                    <button
                      key={inc}
                      onClick={() => handlePlaceBid(auction.current_price + inc)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-xs font-mono font-bold text-slate-200 border border-slate-700 flex flex-col items-center"
                    >
                      <span>+NT$ {inc.toLocaleString()}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-mono">NT$</span>
                    <input
                      type="number"
                      step={auction.min_increment}
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm font-mono text-white focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={() => handlePlaceBid(customBidAmount)}
                    className="py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Gavel className="w-4 h-4 stroke-[2.5]" />
                    <span>立即出價</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Bid History */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">
                  出價歷史紀錄 ({bids.length} 筆)
                </span>
                <span className="text-[11px] text-slate-500">最新出價在最上方</span>
              </div>

              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
                {bids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`p-3 rounded-xl flex items-center justify-between text-xs transition-colors ${
                      index === 0
                        ? 'bg-amber-500/10 border border-amber-500/20 text-slate-100'
                        : 'bg-slate-950/60 border border-slate-800/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={bid.bidder_avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                        alt={bid.bidder_name}
                        className="w-7 h-7 rounded-full bg-slate-800"
                      />
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-1">
                          {bid.bidder_name}
                          {index === 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-bold">
                              領先
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(bid.created_at).toLocaleTimeString('zh-TW')}
                        </div>
                      </div>
                    </div>

                    <div className="font-mono font-bold text-sm text-amber-400">
                      NT$ {bid.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

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
