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
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-100">出價前預授權保證金確認</h3>
        <p className="mt-1 text-xs text-slate-400">
          為杜絕台灣傳統拍賣常見的「得標惡意棄標、不付錢」問題，本場拍賣實施買家履約保證。
        </p>

        {/* Deposit Box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">本次出價預授權圈存金額</span>
            <span className="text-xl font-bold font-mono text-emerald-400">
              NT$ {depositAmount.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>此為信用卡額度圈存，<strong>非實際請款扣帳</strong>，不產生利息手續費。</span>
          </div>
        </div>

        {/* Guarantee Rules */}
        <div className="mt-4 space-y-2 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>未得標自動退回</strong>：他人出價超越且拍賣結束後，立即全額解除圈存。</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>得標享 24 小時付款期</strong>：全額付款完成後，商品立即啟動履約寄送。</span>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>
              <strong>惡意棄標違約條款</strong>：若得標後 24 小時未結帳，系統將正式扣除該保證金，
              <strong className="text-rose-300">80% 直接補償受害賣家</strong>，20% 充作平台審查手續費。
            </span>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="mt-5 flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
          />
          <span className="text-xs text-slate-300">
            我已詳閱並同意《拍賣履約與保證金沒收條款》
          </span>
        </label>

        {/* Action Button */}
        <button
          onClick={handleAuthorize}
          disabled={!agreed || loading}
          className="mt-5 w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>連線金流預授權中...</span>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>確認預授權並開啟出價權限</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
