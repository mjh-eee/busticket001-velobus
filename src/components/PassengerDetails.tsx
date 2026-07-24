import React, { useState } from 'react';
import { Passenger, Schedule, BoardingDroppingPoint, User } from '../types';
import { User as UserIcon, Phone, Mail, MapPin, ArrowRight, ShieldCheck, Plus, Check } from 'lucide-react';

interface PassengerDetailsProps {
  selectedSeats: string[];
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
  schedule: Schedule;
  boardingPoint: BoardingDroppingPoint;
  setBoardingPoint: (bp: BoardingDroppingPoint) => void;
  droppingPoint: BoardingDroppingPoint;
  setDroppingPoint: (dp: BoardingDroppingPoint) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  userPhone: string;
  setUserPhone: (phone: string) => void;
  user: User;
  onProceedToPayment: () => void;
  onBack: () => void;
}

export const PassengerDetails: React.FC<PassengerDetailsProps> = ({
  selectedSeats,
  passengers,
  setPassengers,
  schedule,
  boardingPoint,
  setBoardingPoint,
  droppingPoint,
  setDroppingPoint,
  userEmail,
  setUserEmail,
  userPhone,
  setUserPhone,
  user,
  onProceedToPayment,
  onBack
}) => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handlePreFillPassenger = (index: number, savedP: { name: string; age: number; gender: 'male' | 'female' | 'other' }) => {
    setPassengers(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        name: savedP.name,
        age: savedP.age,
        gender: savedP.gender
      };
      return updated;
    });
  };

  const validateAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!userEmail || !userEmail.includes('@')) {
      errors.email = 'Valid email address is required for sending e-tickets.';
    }

    if (!userPhone || userPhone.length < 8) {
      errors.phone = 'Valid phone number is required for SMS boarding alerts.';
    }

    passengers.forEach((p, idx) => {
      if (!p.name || p.name.trim().length < 2) {
        errors[`name_${idx}`] = `Full name required for Seat ${p.seatNo}`;
      }
      if (!p.age || p.age < 1 || p.age > 120) {
        errors[`age_${idx}`] = `Valid age required for Seat ${p.seatNo}`;
      }
    });

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      onProceedToPayment();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <form onSubmit={validateAndProceed} className="space-y-8">
        
        {/* Contact Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
              Primary Contact Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (E-Ticket Destination)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="alex.vance@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {formErrors.email && <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mobile Number (SMS Boarding Alerts)
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+1 (555) 234-5678"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {formErrors.phone && <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Boarding & Dropping Points Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <MapPin className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
              Select Boarding & Dropping Locations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Boarding Point ({schedule.route.fromCity.split(',')[0]})
              </label>
              <select
                value={boardingPoint.id}
                onChange={(e) => {
                  const found = schedule.boardingPoints.find(bp => bp.id === e.target.value);
                  if (found) setBoardingPoint(found);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {schedule.boardingPoints.map(bp => (
                  <option key={bp.id} value={bp.id}>
                    {bp.time} - {bp.location} ({bp.address})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Dropping Point ({schedule.route.toCity.split(',')[0]})
              </label>
              <select
                value={droppingPoint.id}
                onChange={(e) => {
                  const found = schedule.droppingPoints.find(dp => dp.id === e.target.value);
                  if (found) setDroppingPoint(found);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {schedule.droppingPoints.map(dp => (
                  <option key={dp.id} value={dp.id}>
                    {dp.time} - {dp.location} ({dp.address})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Per-Seat Passenger Forms */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base font-display flex items-center justify-between">
            <span>Passenger Information ({selectedSeats.length} Seats)</span>
            <span className="text-xs text-slate-500 font-normal">IDs required at boarding</span>
          </h3>

          {passengers.map((p, idx) => (
            <div 
              key={p.seatNo}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {p.seatNo}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Passenger {idx + 1}
                  </span>
                </div>

                {/* Pre-fill quick options from saved passengers */}
                {user.savedPassengers && user.savedPassengers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Pre-fill:</span>
                    {user.savedPassengers.map(sp => (
                      <button
                        key={sp.name}
                        type="button"
                        onClick={() => handlePreFillPassenger(idx, sp)}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        + {sp.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-6">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handlePassengerChange(idx, 'name', e.target.value)}
                    placeholder="e.g. Alex Vance"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors[`name_${idx}`] && <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors[`name_${idx}`]}</p>}
                </div>

                {/* Age */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={p.age || ''}
                    onChange={(e) => handlePassengerChange(idx, 'age', Number(e.target.value))}
                    placeholder="28"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors[`age_${idx}`] && <p className="text-xs text-rose-500 mt-1 font-medium">{formErrors[`age_${idx}`]}</p>}
                </div>

                {/* Gender */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={p.gender}
                    onChange={(e) => handlePassengerChange(idx, 'gender', e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ← Back to Seat Selection
          </button>

          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
