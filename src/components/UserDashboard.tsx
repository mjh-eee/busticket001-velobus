import React, { useState } from 'react';
import { Booking, User, Passenger } from '../types';
import { Ticket, User as UserIcon, Calendar, Clock, MapPin, Bus, AlertCircle, RefreshCw, X, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface UserDashboardProps {
  user: User;
  bookings: Booking[];
  onCancelBooking: (bookingId: string) => Promise<void>;
  onSavePassengers: (passengers: Omit<Passenger, 'seatNo'>[]) => void;
  onBookNew: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  bookings,
  onCancelBooking,
  onSavePassengers,
  onBookNew
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'passengers' | 'profile'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<Booking | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [savedPassList, setSavedPassList] = useState<Omit<Passenger, 'seatNo'>[]>(
    user.savedPassengers || [
      { name: 'Alex Vance', age: 29, gender: 'male' },
      { name: 'Sarah Vance', age: 27, gender: 'female' }
    ]
  );
  const [newPassName, setNewPassName] = useState('');
  const [newPassAge, setNewPassAge] = useState<number>(28);
  const [newPassGender, setNewPassGender] = useState<'male' | 'female' | 'other'>('male');

  const upcomingBookings = bookings.filter(b => b.bookingStatus === 'confirmed');
  const pastBookings = bookings.filter(b => b.bookingStatus === 'cancelled');

  const handleConfirmCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    await onCancelBooking(bookingId);
    setCancellingId(null);
    setSelectedTicket(null);
  };

  const handleAddSavedPassenger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassName.trim()) return;

    const updated = [...savedPassList, { name: newPassName.trim(), age: Number(newPassAge), gender: newPassGender }];
    setSavedPassList(updated);
    onSavePassengers(updated);
    setNewPassName('');
  };

  const handleRemoveSavedPassenger = (index: number) => {
    const updated = savedPassList.filter((_, i) => i !== index);
    setSavedPassList(updated);
    onSavePassengers(updated);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Profile Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-700/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 p-1 shadow-md">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
              alt={user.name}
              className="w-full h-full rounded-full object-cover" 
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
              {user.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user.email} • {user.phone || '+1 (555) 234-5678'}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
              VeloBus VIP Member
            </span>
          </div>
        </div>

        <button
          onClick={onBookNew}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all cursor-pointer"
        >
          + Book New Journey
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'upcoming'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Upcoming Trips ({upcomingBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'past'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Cancelled & Past ({pastBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('passengers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'passengers'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Saved Passengers ({savedPassList.length})
        </button>
      </div>

      {/* Tab 1: Upcoming Bookings */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
              <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">No Active Upcoming Bookings</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ready for your next trip? Search luxury express buses across 120+ top routes.
              </p>
              <button
                onClick={onBookNew}
                className="mt-4 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer"
              >
                Search Buses
              </button>
            </div>
          ) : (
            upcomingBookings.map((b) => (
              <div 
                key={b.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                      CONFIRMED
                    </span>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      PNR: {b.pnr}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Booked on {new Date(b.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                      {b.schedule.bus.operator} ({b.schedule.bus.type})
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                      {b.schedule.route.fromCity} → {b.schedule.route.toCity}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date: <strong>{b.schedule.date}</strong> | Departs: <strong>{b.schedule.departureTime}</strong> | Seats: <strong className="text-indigo-600">{b.seats.join(', ')}</strong>
                    </p>
                  </div>

                  <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-2">
                    <button
                      onClick={() => setSelectedTicket(b)}
                      className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Ticket
                    </button>

                    <button
                      onClick={() => handleConfirmCancel(b.id)}
                      disabled={cancellingId === b.id}
                      className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {cancellingId === b.id ? 'Cancelling...' : 'Cancel & Refund'}
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Past / Cancelled Bookings */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastBookings.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-medium">
              No cancelled or past bookings.
            </div>
          ) : (
            pastBookings.map((b) => (
              <div 
                key={b.id}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2 opacity-75"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold">
                    CANCELLED & REFUNDED
                  </span>
                  <span className="font-mono text-xs text-slate-400">PNR: {b.pnr}</span>
                </div>
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">
                  {b.schedule.route.fromCity} → {b.schedule.route.toCity}
                </h4>
                <p className="text-xs text-slate-500">
                  Fare: ${b.totalFare} | Refund Processed: ${(b.totalFare * 0.9).toFixed(2)}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Saved Passengers */}
      {activeTab === 'passengers' && (
        <div className="space-y-6">
          {/* Add New Passenger Form */}
          <form onSubmit={handleAddSavedPassenger} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Add New Saved Passenger</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="Full Legal Name"
                  value={newPassName}
                  onChange={(e) => setNewPassName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="number"
                  placeholder="Age"
                  value={newPassAge || ''}
                  onChange={(e) => setNewPassAge(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <select
                  value={newPassGender}
                  onChange={(e) => setNewPassGender(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </form>

          {/* List of Saved Passengers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedPassList.map((sp, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sp.name}</h4>
                  <p className="text-xs text-slate-500">
                    {sp.gender.toUpperCase()} • {sp.age} years old
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveSavedPassenger(idx)}
                  className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer"
                  title="Remove passenger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket View Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Digital Boarding Ticket
            </h3>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span>PNR: {selectedTicket.pnr}</span>
                <span className="text-emerald-600">CONFIRMED</span>
              </div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">
                {selectedTicket.schedule.bus.operator}
              </p>
              <p>
                {selectedTicket.schedule.route.fromCity} → {selectedTicket.schedule.route.toCity}
              </p>
              <p>Date: {selectedTicket.schedule.date} | Departs: {selectedTicket.schedule.departureTime}</p>
              <p>Seats: <strong className="text-indigo-600">{selectedTicket.seats.join(', ')}</strong></p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
