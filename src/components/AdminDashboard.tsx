import React, { useState } from 'react';
import { AdminStats, Bus, Route, Schedule } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
import { LayoutDashboard, DollarSign, Ticket, Bus as BusIcon, TrendingUp, Plus, X, Check, ShieldCheck } from 'lucide-react';

interface AdminDashboardProps {
  stats: AdminStats | null;
  buses: Bus[];
  routes: Route[];
  schedules: Schedule[];
  onAddSchedule: (newSch: { busId: string; routeId: string; departureTime: string; arrivalTime: string; date: string; baseFare: number }) => Promise<void>;
  onRefreshStats: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  buses,
  routes,
  schedules,
  onAddSchedule,
  onRefreshStats
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || 'bus-1');
  const [selectedRouteId, setSelectedRouteId] = useState(routes[0]?.id || 'route-nyc-bos');
  const [departureTime, setDepartureTime] = useState('08:30');
  const [arrivalTime, setArrivalTime] = useState('12:45');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [baseFare, setBaseFare] = useState(42);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAddSchedule({
      busId: selectedBusId,
      routeId: selectedRouteId,
      departureTime,
      arrivalTime,
      date: travelDate,
      baseFare: Number(baseFare)
    });
    setIsSubmitting(false);
    setShowAddModal(false);
    onRefreshStats();
  };

  if (!stats) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-500">Loading Operator Analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Operator Control Center</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-display">
            Analytics & Fleet Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time revenue monitoring, seat occupancy metrics, and express dispatch.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Dispatch New Bus Schedule</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              $
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            ${stats.totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% vs last week</span>
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tickets Sold</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {stats.totalBookings}
          </p>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            {stats.activeRoutes} active routes
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Occupancy</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold text-xs">
              %
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {stats.averageOccupancy}%
          </p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
            High demand across sleepers
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fleet Size</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
              <BusIcon className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {stats.totalBuses} Buses
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            Double-deckers & Supercoaches
          </p>
        </div>

      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Revenue Area Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                Weekly Revenue Trend
              </h3>
              <p className="text-xs text-slate-500">Gross earnings per day ($)</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyRevenue}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Routes Bar Chart */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
              Route Revenue Performance
            </h3>
            <p className="text-xs text-slate-500">Total earnings by top route ($)</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.popularRoutesStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="routeName" stroke="#94a3b8" fontSize={10} tick={false} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="revenue" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
          Recent Ticket Transactions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/60 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">PNR</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Route</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Seats</th>
                <th className="pb-3">Total Fare</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
              {stats.recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">{b.pnr}</td>
                  <td className="py-3 font-bold text-slate-800 dark:text-slate-200">{b.userName}</td>
                  <td className="py-3">{b.schedule.route.fromCity.split(',')[0]} → {b.schedule.route.toCity.split(',')[0]}</td>
                  <td className="py-3 text-slate-500">{b.schedule.date}</td>
                  <td className="py-3 font-bold">{b.seats.join(', ')}</td>
                  <td className="py-3 font-extrabold text-slate-900 dark:text-white">${b.totalFare}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      b.bookingStatus === 'confirmed' 
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' 
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                    }`}>
                      {b.bookingStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 border border-slate-200 dark:border-slate-700 shadow-2xl relative">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Dispatch New Bus Schedule
            </h3>

            <form onSubmit={handleCreateSchedule} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bus Fleet
                </label>
                <select
                  value={selectedBusId}
                  onChange={(e) => setSelectedBusId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {buses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.operator} - {b.type} ({b.busNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Route
                </label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.fromCity} → {r.toCity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Travel Date
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Base Fare ($)
                  </label>
                  <input
                    type="number"
                    value={baseFare}
                    onChange={(e) => setBaseFare(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Dispatching...' : 'Confirm Dispatch Schedule'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
