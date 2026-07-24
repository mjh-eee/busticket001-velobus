import React, { useState } from 'react';
import { Schedule, Passenger, BoardingDroppingPoint, PaymentMethod } from '../types';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, ArrowRight, Wallet, Sparkles, Building2 } from 'lucide-react';

interface CheckoutPaymentProps {
  schedule: Schedule;
  selectedSeats: string[];
  passengers: Passenger[];
  boardingPoint: BoardingDroppingPoint;
  droppingPoint: BoardingDroppingPoint;
  totalFare: number;
  discountAmount: number;
  userEmail: string;
  onConfirmBooking: (paymentMethod: PaymentMethod) => void;
  onBack: () => void;
}

export const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  schedule,
  selectedSeats,
  passengers,
  boardingPoint,
  droppingPoint,
  totalFare,
  discountAmount,
  userEmail,
  onConfirmBooking,
  onBack
}) => {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [cardName, setCardName] = useState(passengers[0]?.name || 'Alex Vance');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onConfirmBooking(method);
    }, 1500); // simulate realistic payment gateway response
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Payment Methods Form */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-5">
            
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-700/60">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                Select Payment Method
              </h3>
            </div>

            {/* Payment Options Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                { id: 'applepay', name: 'Apple / Google Pay', icon: Wallet },
                { id: 'bkash', name: 'SSLCommerz / Mobile Wallet', icon: Building2 },
                { id: 'paypal', name: 'PayPal Express', icon: Sparkles }
              ].map(item => {
                const Icon = item.icon;
                const isSelected = method === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMethod(item.id as PaymentMethod)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-bold ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="text-xs">{item.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Card Inputs Form */}
            {method === 'card' && (
              <form onSubmit={handlePay} className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM/YY"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Secure Payment...
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pay ${totalFare.toFixed(2)} & Confirm Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {method !== 'card' && (
              <div className="pt-4 text-center space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  You will be redirected to complete payment with <strong>{method.toUpperCase()}</strong> safely.
                </p>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {isProcessing ? 'Connecting Gateway...' : `Proceed with ${method.toUpperCase()}`}
                </button>
              </div>
            )}

          </div>

          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 transition-colors"
          >
            ← Back to Passenger Details
          </button>

        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-md space-y-5 sticky top-20">
            
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-display pb-3 border-b border-slate-100 dark:border-slate-700/60">
              Trip Summary
            </h4>

            {/* Operator & Bus Info */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Operator:</span>
                <span className="font-bold text-slate-900 dark:text-white">{schedule.bus.operator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bus Type:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{schedule.bus.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Route:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {schedule.route.fromCity.split(',')[0]} → {schedule.route.toCity.split(',')[0]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Travel Date:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{schedule.date}</span>
              </div>
            </div>

            {/* Seats & Passengers */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Seats:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Boarding Point:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 text-right">{boardingPoint.location} ({boardingPoint.time})</span>
              </div>
            </div>

            {/* Total Fare Breakdown */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Total Charged:</span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                  ${totalFare.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                E-ticket confirmation will be sent to <strong>{userEmail}</strong>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-500 flex-shrink-0" />
              <span>Full refund guaranteed if cancelled up to 6 hours before departure.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
