'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import AuctionCard from '@/components/AuctionCard';
import { INITIAL_AUCTIONS } from '@/lib/mockData';
import {
  Gavel,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  Lock,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const categories = ['全部', '電玩電競', '名錶珠寶', '3C 數位'];

  const filteredAuctions =
    selectedCategory === '全部'
      ? INITIAL_AUCTIONS
      : INITIAL_AUCTIONS.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-[#D4F652] selection:text-slate-950">
      {/* =========================================================================
          HERO SECTION: Bright Sky Blue + Clouds + 3D Floating Carousel Cards
         ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#007CF0] via-[#008BF8] to-[#5EB9FF] text-white pt-2 pb-24 sm:pb-32">
        {/* Soft Cloud Shapes Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -bottom-10 -left-20 w-[600px] h-[350px] bg-white/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-20 w-[700px] h-[400px] bg-white/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-white/20 rounded-full blur-2xl" />
        </div>

        {/* Floating Top Navbar */}
        <Navbar />

        {/* Main Hero Header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] max-w-4xl mx-auto">
            Building the future with <br className="hidden sm:inline" />
            live bidding and trust
          </h1>

          <p className="mt-6 text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">
            告別台灣傳統拍賣老舊體驗與得標棄標放鳥。首創「信用卡預授權保證金 + 毫秒級跳價 + 防壓秒保護」，為買賣雙方打造極致透明安心的競價平台。
          </p>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="#auctions"
              className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-black/25 hover:bg-black/40 text-white backdrop-blur-md transition-all active:scale-95 shadow-sm"
            >
              瀏覽即時專場
            </Link>

            <Link
              href="#guarantee"
              className="px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold tracking-wider uppercase bg-[#D4F652] hover:bg-[#c4e83f] text-slate-950 transition-all flex items-center gap-2 shadow-xl shadow-sky-950/20 active:scale-95 group"
            >
              <span>防棄標履約保障</span>
              <div className="w-5 h-5 rounded-full bg-slate-950 text-[#D4F652] flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </Link>
          </div>
        </div>

        {/* 3D Floating Curved Ribbon of Cards (Recreating the Hero Visual) */}
        <div className="mt-14 sm:mt-20 relative max-w-6xl mx-auto px-4 sm:px-6 z-10">
          <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto pb-6 pt-2 scrollbar-none [perspective:1000px]">
            {/* Card 1: Live Status */}
            <div className="w-40 sm:w-44 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 shadow-xl shadow-sky-950/15 transform -rotate-6 hover:rotate-0 transition-transform shrink-0 border border-white">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">即時廣播</div>
              <div className="text-xl font-black font-mono text-[#0082FB] mt-1">&lt; 50ms</div>
              <div className="mt-2 text-[11px] text-slate-600 font-medium">Supabase Realtime 毫秒級跳價</div>
              <div className="mt-3 h-1.5 w-full bg-sky-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0082FB] w-4/5 rounded-full" />
              </div>
            </div>

            {/* Card 2: Highest Bid Pulse */}
            <div className="w-44 sm:w-48 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 shadow-xl shadow-sky-950/15 transform -rotate-3 hover:rotate-0 transition-transform shrink-0 border border-white">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                <span>PS5 Pro 典藏版</span>
                <span className="text-rose-500 font-bold">LIVE</span>
              </div>
              <div className="text-2xl font-black font-mono text-slate-900 mt-1">NT$ 33,500</div>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>台北林先生 領先</span>
              </div>
            </div>

            {/* Card 3: User Avatar & Trust */}
            <div className="w-44 sm:w-52 p-4 rounded-2xl bg-white/95 backdrop-blur-md text-slate-900 shadow-xl shadow-sky-950/15 transform hover:scale-105 transition-transform shrink-0 border border-white">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Verified Bidder"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#D4F652]"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">實名認證買家</div>
                  <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3 h-3" /> 已預授權保證金
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-xs font-mono">
                <span className="text-slate-400">圈存額度</span>
                <span className="font-bold text-slate-800">NT$ 1,000</span>
              </div>
            </div>

            {/* Card 4: Dark Pill Card (Expertise & Security) */}
            <div className="w-44 sm:w-48 p-4 rounded-2xl bg-[#0f172a] text-white shadow-xl shadow-sky-950/20 transform rotate-2 hover:rotate-0 transition-transform shrink-0 border border-slate-800">
              <div className="flex items-center gap-1.5 text-[#D4F652] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>防壓秒延長</span>
              </div>
              <div className="text-xl font-black font-mono text-white mt-1">+120s</div>
              <p className="mt-2 text-[10px] text-slate-400 leading-snug">
                結標前 2 分鐘出價自動延長，杜絕外掛最後 1 秒搶標
              </p>
            </div>

            {/* Card 5: Neon Lime Card (Data points) */}
            <div className="w-40 sm:w-44 p-4 rounded-2xl bg-[#D4F652] text-slate-950 shadow-xl shadow-sky-950/15 transform rotate-6 hover:rotate-0 transition-transform shrink-0">
              <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">得標付款率</div>
              <div className="text-3xl font-black font-mono text-slate-950 mt-1">100%</div>
              <p className="mt-2 text-[10px] text-slate-800 font-medium leading-tight">
                違約沒收 80% 補償受害賣家
              </p>
            </div>
          </div>

          {/* Social Proof Star Rating */}
          <div className="mt-6 text-center text-xs font-medium text-white/90 flex items-center justify-center gap-2">
            <span>Rated 4.9/5 by 4,900+ active bidders & sellers</span>
            <div className="flex text-[#D4F652]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PARTNER & SECURITY TICKER (Logoipsum style from Reference)
         ========================================================================= */}
      <section className="py-8 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-semibold text-xs tracking-wider uppercase opacity-75">
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <ShieldCheck className="w-4 h-4 text-[#0082FB]" /> TapPay 信用卡預授權
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Lock className="w-4 h-4 text-emerald-500" /> 綠界 ECPay 履約信託
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <CheckCircle2 className="w-4 h-4 text-slate-900" /> 7-ELEVEN / 全家 C2C 串接
            </span>
            <span className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
              <Zap className="w-4 h-4 text-amber-500" /> LINE 官方即時超標推播
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BENTO GRID SECTION: Solving Taiwan's 2 Big Problems
          (Directly matching the Bento style in Reference Image)
         ========================================================================= */}
      <section id="guarantee" className="py-20 sm:py-28 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest uppercase text-slate-400">
              <span>•</span>
              <span>ZERO-DEFAULT ARCHITECTURE</span>
              <span>•</span>
            </div>

            <h2 className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              A modern auction platform <br />
              dedicated to building{' '}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-[#0082FB] font-extrabold text-2xl sm:text-4xl align-middle">
                smarter ⏱
              </span>{' '}
              and{' '}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4F652] text-slate-950 font-extrabold text-2xl sm:text-4xl align-middle">
                zero default 💡
              </span>
            </h2>
          </div>

          {/* Bento Grid: 4 Boxes Matching Reference */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Box 1 (Blue Card with Photo & White Inner Box) - md:col-span-4 */}
            <div className="md:col-span-4 rounded-[32px] bg-[#0082FB] p-7 text-white flex flex-col justify-between shadow-xl shadow-sky-500/10 min-h-[420px] relative overflow-hidden group">
              <div className="flex justify-between items-start z-10">
                <span className="text-lg font-black tracking-tight text-white uppercase">
                  BidPulse
                </span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* Realistic Person Photo */}
              <div className="my-auto py-4 flex justify-center z-10">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
                  alt="Verified User"
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-white/30 shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* White Inner Card */}
              <div className="rounded-2xl bg-white p-5 text-slate-900 shadow-lg z-10">
                <div className="text-3xl font-black font-mono tracking-tight text-slate-900">
                  100%
                </div>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed font-medium">
                  所有競價者出價前皆完成信用卡預授權保證金驗證，徹底根除假帳號棄標。
                </p>
              </div>
            </div>

            {/* Box 2 (Clean White Card with Testimonials & Stat) - md:col-span-4 */}
            <div className="md:col-span-4 rounded-[32px] bg-white p-7 border border-slate-200/80 shadow-xl shadow-slate-200/50 flex flex-col justify-between min-h-[420px]">
              <div>
                <div className="text-xs font-semibold text-slate-400">
                  Commitment to measurable trust
                </div>
                <div className="text-5xl font-black font-mono text-slate-900 mt-2">
                  NT$ 0
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1">
                  正常履行交易之買家完全 0 扣款、0 手續費
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    alt="user"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    alt="user"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    alt="user"
                  />
                </div>
                <blockquote className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">
                  “以前在傳統拍賣，高單價商品得標後常常被放鳥；BidPulse 讓每筆出價都有真實履約保證，違約還能拿到 80% 補償，太讓人安心了！”
                </blockquote>
              </div>
            </div>

            {/* Box 3 & Box 4 Column - md:col-span-4 */}
            <div className="md:col-span-4 flex flex-col gap-6 justify-between">
              {/* Box 3: Vibrant Neon Lime Card */}
              <div className="flex-1 rounded-[32px] bg-[#D4F652] p-7 text-slate-950 flex flex-col justify-between shadow-xl shadow-lime-500/10">
                <div>
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Realtime Sync Speed
                  </div>
                  <div className="text-4xl sm:text-5xl font-black font-mono text-slate-950 mt-1">
                    &lt; 50ms
                  </div>
                </div>
                <p className="mt-4 text-xs font-semibold text-slate-800 leading-relaxed">
                  Supabase WebSocket 原生廣播，無需再手動按 F5 刷新頁面，出價數字毫秒級翻牌跳動。
                </p>
              </div>

              {/* Box 4: Dark Pill Card */}
              <div className="rounded-[28px] bg-[#0f172a] p-6 text-white flex items-center justify-between shadow-xl shadow-slate-950/10">
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    防壓秒自動延時
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5">
                    結標前兩分鐘有人出價自動順延
                  </div>
                </div>
                <div className="text-2xl font-black font-mono text-[#D4F652]">
                  +120s
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          LIVE AUCTIONS SHOWCASE (Modern White Cards Grid)
         ========================================================================= */}
      <section id="auctions" className="py-20 sm:py-28 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#0082FB]">
                HOT AUCTION ROOMS
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                熱門即時拍賣專場
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                點擊進入即時競價大廳，感受動態翻牌跳價與防壓秒刺激體驗
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Auction Cards Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CALL TO ACTION & FOOTER
         ========================================================================= */}
      <section className="py-16 bg-[#0082FB] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            準備好體驗次世代競價平台了嗎？
          </h3>
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-xl mx-auto font-normal">
            免除手動重新整理網頁，告別得標惡意棄標放鳥。
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="#auctions"
              className="px-8 py-3.5 rounded-full font-extrabold text-sm bg-[#D4F652] hover:bg-[#c4e83f] text-slate-950 shadow-xl shadow-sky-950/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>立即進入競拍專場</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-white border-t border-slate-100 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#0082FB] text-white flex items-center justify-center text-xs">
              <Gavel className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span>BidPulse 競價</span>
          </div>
          <p>© 2026 BidPulse Platform · Next.js 16 + Supabase + Vercel</p>
        </div>
      </footer>
    </div>
  );
}
