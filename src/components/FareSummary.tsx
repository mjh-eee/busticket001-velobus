import React, { useState } from 'react';
import { Schedule } from '../types';
import { Tag, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface FareSummaryProps {
  schedule: Schedule;
  selectedSeats: string[];
  appliedCoupon: string | null;
  discountAmount: number;
  onApplyCoupon: (code: string) => void;
  onProceed: () => void;
  isProceedDisabled?: boolean;
}

export const FareSummary: React.FC<FareSummaryProps> = ({
  schedule,
  selectedSeats,
  appliedCoupon,
  discountAmount,
  onApplyCoupon,
  onProceed,
  isProceedDisabled
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const numSeats = selectedSeats.length;
  const baseTotal = schedule.baseFare * numSeats;
  const taxAmount = Math.round(baseTotal * 0.08 * 100) / 100;
  const convenienceFee = Math.round(numSeats * 2.50 * 100) / 100;
  const grandTotal = Math.max(0, Math.round((baseTotal + taxAmount + convenienceFee - discountAmount) * 100) / 100);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError('');
    onApplyCoupon(couponInput.trim());
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-md space-y-5 sticky top-20">
      
      {/* Route Header */}
      <div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Fare Breakdown
        </div>
        <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
          {schedule.route.fromCity.split(',')[0]} → {schedule.route.toCity.split(',')[0]}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {schedule.date} • {schedule.departureTime}
        </p>
      </div>

      {/* Selected Seats List */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
          <span>Selected Seats ({numSeats})</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">
            {numSeats > 0 ? selectedSeats.join(', ') : 'None selected'}
          </span>
        </div>

        {numSeats === 0 && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Please click on the seat map to select at least 1 seat.</span>
          </p>
        )}
      </div>

      {/* Pricing Lines */}
      {numSeats > 0 && (
        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          
          <div className="flex justify-between">
            <span>Seat Fare (${schedule.baseFare} x {numSeats})</span>
            <span className="font-semibold text-slate-900 dark:text-white">${baseTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Taxes & Operator Fee (8%)</span>
            <span className="font-semibold text-slate-900 dark:text-white">${taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Platform Convenience Fee</span>
            <span className="font-semibold text-slate-900 dark:text-white">${convenienceFee.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Promo Discount ({appliedCoupon})</span>
              </span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Grand Total */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">Total Amount</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

        </div>
      )}

      {/* Coupon Code Input */}
      {numSeats > 0 && (
        <form onSubmit={handleApply} className="pt-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Have a Promo Code?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              placeholder="e.g. VELO20"
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>

          {/* Quick coupon chips */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] text-slate-400">Try:</span>
            <button
              type="button"
              onClick={() => { setCouponInput('VELO20'); onApplyCoupon('VELO20'); }}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              VELO20 (20% OFF)
            </button>
          </div>
        </form>
      )}

      {/* Proceed CTA Button */}
      <button
        onClick={onProceed}
        disabled={isProceedDisabled || numSeats === 0}
        className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
          isProceedDisabled || numSeats === 0
            ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 shadow-indigo-600/20 hover:scale-[1.02]'
        }`}
      >
        <span>Proceed to Passenger Info</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* Guarantee Notice */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>Instant Ticket Guarantee & Free Refund</span>
      </div>

    </div>
  );
};
