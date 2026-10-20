'use client';

import { useState } from 'react';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  depositAmount: number;
  onConfirm: () => void;
}

export default function DepositModal({ isOpen, onClose, depositAmount, onConfirm }: DepositModalProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthorize = () => {
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-[32px] shadow-2xl p-7 text-slate-900 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0082FB] flex items-center justify-center mb-4 shadow-sm">
          <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
        </div>

        <h3 className="text-xl font-black text-slate-900 tracking-tight">
          出價前預授權保證金確認
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-medium">
          為杜絕台灣傳統拍賣「得標者放鳥惡意棄標、不付錢」問題，本平台實施全流程買家履約保證。
        </p>

        {/* Deposit Box */}
        <div className="mt-5 p-5 rounded-2xl bg-[#F9FAFB] border border-slate-200">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-500">本場拍賣預授權圈存金額</span>
            <span className="text-2xl font-black font-mono text-[#0082FB]">
              NT$ {depositAmount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2.5 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>此為信用卡額度圈存，<strong>非實際請款扣帳</strong>，不產生任何利息與手續費。</span>
          </div>
        </div>

        {/* Guarantee Rules */}
        <div className="mt-5 space-y-3 text-xs text-slate-700 font-medium">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>未得標自動退回</strong>：他人出價超越且拍賣結束後，系統即刻全額解除圈存。</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>得標享 24 小時付款期</strong>：全額付款後即由第三方信託託管並啟動寄件。</span>
          </div>
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              <strong>惡意棄標違約條款</strong>：若得標後 24 小時未結帳，系統將正式扣除保證金，
              <strong className="text-rose-600">80% 直接補償給受害賣家</strong>，20% 充作平台手續費。
            </span>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="mt-6 flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[#0082FB] focus:ring-[#0082FB]"
          />
          <span className="text-xs font-semibold text-slate-700">
            我已詳閱並同意《拍賣履約與保證金沒收條款》
          </span>
        </label>

        {/* Action Button */}
        <button
          onClick={handleAuthorize}
          disabled={!agreed || loading}
          className="mt-6 w-full py-3.5 px-5 rounded-2xl font-black text-sm bg-[#D4F652] hover:bg-[#c4e83f] text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2 active:scale-95"
        >
          {loading ? (
            <span>連線金流預授權中...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>確認預授權並開通出價權限</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
