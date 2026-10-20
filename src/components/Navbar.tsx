'use client';

import Link from 'next/link';
import { Gavel, ShieldCheck, Zap, CreditCard, Bell } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Gavel className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-1.5">
              BidPulse 競價
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">次世代即時防棄標拍賣</p>
          </div>
        </Link>

        {/* Feature Highlights */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>履約保證金機制（零棄標）</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>防壓秒自動延時 +120s</span>
          </div>
        </div>

        {/* User Info / Card Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <CreditCard className="w-3.5 h-3.5" />
            <span>已綁卡 (授權額度正常)</span>
          </div>
          <button className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-inner">
              Jimmy
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
