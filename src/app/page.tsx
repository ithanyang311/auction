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
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-800/80">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-amber-400 mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>解決台灣傳統拍賣網站「介面過時」與「得標者不付錢」痛點</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white max-w-4xl mx-auto">
            次世代{' '}
            <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 bg-clip-text text-transparent">
              即時競價
            </span>{' '}
            與履約保證拍賣平台
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            告別手動重新整理網頁與惡意棄標！採用 <strong>Supabase WebSocket 毫秒級價格廣播</strong>、
            <strong>信用卡預授權保證金</strong> 與 <strong>防壓秒自動延時機制</strong>，打造最安心流暢的競標體驗。
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>毫秒級無延遲廣播</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>違約沒收 80% 補償受害賣家</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>防壓秒延長 +120s</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Auction Lobby */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Gavel className="w-5 h-5 text-amber-400" />
              <span>正在熱烈競標中的專場 (Live Auctions)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              點擊任一拍賣品進入實時動態競標大廳，感受零延遲跳價反饋
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Auctions Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {/* Comparison Section (Old vs New) */}
        <div className="mt-20 p-8 rounded-3xl bg-slate-900/50 border border-slate-800 relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-xl font-bold text-white">為什麼台灣需要新一代拍賣系統？</h3>
            <p className="mt-2 text-xs text-slate-400">
              傳統拍賣網站多年未迭代，棄標無成本、流程老舊；BidPulse 專為解決這兩大痛點而生。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Traditional Sites */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-rose-500/20 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5" />
                <span>台灣傳統拍賣網站現況</span>
              </div>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>得標者人間蒸發</strong>：出價零成本，得標後棄標只扣信用評級，賣家白等一場。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>介面停留在 15 年前</strong>：每次看價格都要手動 F5 重新整理，容易錯過結標時機。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">✕</span>
                  <span><strong>外掛壓秒偷標</strong>：最後 1 秒被機器人程式壓標，正常買家毫無還手機會。</span>
                </li>
              </ul>
            </div>

            {/* NextGen Platform */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/20 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>本專案 (NextGen BidPulse) 解決方案</span>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>信用卡預授權保證金</strong>：出價圈存額度，逾期棄標直接沒收 80% 補償受害賣家！</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Supabase WebSocket 毫秒級推播</strong>：出價數字翻牌跳動，全場觀眾零延遲同步。</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>智慧防壓秒延長 (+120s)</strong>：結標前兩分鐘有人出價自動順延，營造緊張刺激公平成交環境。</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
        <p>BidPulse Modern Auction Platform · Next.js (React 19) + Supabase + Vercel</p>
      </footer>
    </div>
  );
}
