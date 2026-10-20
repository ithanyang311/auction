'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Auction } from '@/types/auction';
import { Clock, ShieldCheck, Flame, ArrowUpRight, User } from 'lucide-react';

interface AuctionCardProps {
  auction: Auction;
}

export default function AuctionCard({ auction }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0, isUrgent: false });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date().getTime();
      const end = new Date(auction.end_at).getTime();
      const diff = Math.max(0, end - now);

      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      const isUrgent = diff <= 120 * 1000;

      setTimeLeft({ minutes: m, seconds: s, isUrgent });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [auction.end_at]);

  return (
    <Link
      href={`/auctions/${auction.id}`}
      className="group block rounded-3xl bg-white border border-slate-200/80 hover:border-sky-300 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/10 overflow-hidden flex flex-col"
    >
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-sm">
            {auction.category}
          </span>
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#D4F652] text-slate-950 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            圈存 NT$ {auction.deposit_required.toLocaleString()}
          </span>
        </div>

        {/* Countdown Overlay */}
        <div className="absolute bottom-3 left-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold backdrop-blur-md shadow-sm ${
              timeLeft.isUrgent
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-950/80 text-white'
            }`}
          >
            {timeLeft.isUrgent ? (
              <Flame className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-[#D4F652]" />
            )}
            <span>
              剩餘 {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
            {timeLeft.isUrgent && <span className="text-[10px] ml-1">防壓秒生效</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0082FB] transition-colors line-clamp-2 leading-snug">
            {auction.title}
          </h3>
          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {auction.description}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              當前最高價
              {auction.current_winner_name && (
                <span className="text-slate-600 font-semibold flex items-center gap-0.5">
                  <User className="w-2.5 h-2.5" />
                  {auction.current_winner_name}
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">
              NT$ {auction.current_price.toLocaleString()}
            </div>
          </div>

          <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#D4F652] text-slate-800 group-hover:text-slate-950 flex items-center justify-center transition-all group-hover:scale-110 shadow-sm">
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        </div>
      </div>
    </Link>
  );
}
