'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Auction } from '@/types/auction';
import { Clock, ShieldCheck, Flame, ChevronRight, User } from 'lucide-react';

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
      const isUrgent = diff <= 120 * 1000; // 剩不到 2 分鐘

      setTimeLeft({ minutes: m, seconds: s, isUrgent });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [auction.end_at]);

  return (
    <Link
      href={`/auctions/${auction.id}`}
      className="group block rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 overflow-hidden flex flex-col"
    >
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 backdrop-blur-md text-slate-200 border border-slate-700">
            {auction.category}
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            圈存 NT$ {auction.deposit_required.toLocaleString()}
          </span>
        </div>

        {/* Countdown Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold backdrop-blur-md border ${
              timeLeft.isUrgent
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                : 'bg-slate-900/80 border-slate-700 text-slate-200'
            }`}
          >
            {timeLeft.isUrgent ? <Flame className="w-3.5 h-3.5 text-rose-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
            <span>
              剩餘 {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
            {timeLeft.isUrgent && <span className="text-[10px] text-rose-400 ml-1">壓秒延時生效中</span>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {auction.title}
          </h3>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2">{auction.description}</p>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-end justify-between">
          <div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              當前出價
              {auction.current_winner_name && (
                <span className="text-slate-500 flex items-center gap-0.5">
                  <User className="w-2.5 h-2.5" />
                  {auction.current_winner_name}
                </span>
              )}
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              NT$ {auction.current_price.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>進入競價室</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
