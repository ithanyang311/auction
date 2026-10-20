'use client';

import Link from 'next/link';
import { Gavel, ShieldCheck, Zap, ArrowUpRight, Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2 z-50">
      <header className="max-w-7xl mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-5 py-3 flex items-center justify-between text-white shadow-lg shadow-sky-950/10">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-white text-[#0082FB] flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-transform">
            <Gavel className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            BidPulse
            <span className="w-2 h-2 rounded-full bg-[#D4F652] animate-pulse"></span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
          <Link href="/" className="hover:text-white transition-colors">
            首頁
          </Link>
          <Link href="#auctions" className="hover:text-white transition-colors flex items-center gap-1">
            即時拍賣專場
            <span className="text-[10px] bg-[#D4F652] text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
              HOT
            </span>
          </Link>
          <Link href="#guarantee" className="hover:text-white transition-colors">
            防棄標履約機制
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            防壓秒技術
          </Link>
        </nav>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <Link
            href="#auctions"
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
          >
            <span>瀏覽拍賣</span>
          </Link>

          <Link
            href="#auctions"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full bg-[#D4F652] hover:bg-[#c4e83f] text-slate-950 shadow-md shadow-lime-950/10 hover:scale-105 active:scale-95 transition-all"
          >
            <span>立即出價</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </header>
    </div>
  );
}
