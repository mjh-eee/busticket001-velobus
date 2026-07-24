import React, { useState } from 'react';
import { ArrowLeftRight, Calendar, MapPin, Users, Search, Sparkles, Shield, Clock, Award, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSearchProps {
  fromCity: string;
  setFromCity: (city: string) => void;
  toCity: string;
  setToCity: (city: string) => void;
  travelDate: string;
  setTravelDate: (date: string) => void;
  passengersCount: number;
  setPassengersCount: (count: number) => void;
  onSearch: () => void;
  availableCities: string[];
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  fromCity,
  setFromCity,
  toCity,
  setToCity,
  travelDate,
  setTravelDate,
  passengersCount,
  setPassengersCount,
  onSearch,
  availableCities
}) => {
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleQuickSelect = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pt-10 pb-16 md:py-16 transition-colors">
      
      {/* Background Radial Glow Blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-150px] left-[-150px] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Description */}
        <div className="max-w-3xl mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Next-Gen Bus Express Network</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6 font-display"
          >
            Premium travel,<br />
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              redefined for everyone.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed"
          >
            Book luxury bus journeys across 5,000+ routes with real-time tracking, 24/7 support, and flexible cancellation.
          </motion.p>
        </div>

        {/* Search Widget Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] dark:shadow-2xl border border-slate-100 dark:border-slate-800"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Leaving From */}
            <div className="relative md:col-span-3 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 block">
                Leaving From
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  onFocus={() => setShowFromDropdown(true)}
                  onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                  placeholder="Departure city"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/80 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white transition-all text-sm focus:outline-none"
                />
              </div>

              {/* City Suggestions Dropdown */}
              {showFromDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-30 max-h-48 overflow-y-auto">
                  {availableCities
                    .filter(c => c.toLowerCase().includes(fromCity.toLowerCase()))
                    .map(city => (
                      <button
                        key={city}
                        onClick={() => {
                          setFromCity(city);
                          setShowFromDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{city}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center md:col-span-1 pb-1">
              <button
                type="button"
                onClick={handleSwap}
                className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 text-slate-600 dark:text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                title="Swap departure and arrival"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Going To */}
            <div className="relative md:col-span-3 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 block">
                Going To
              </label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  onFocus={() => setShowToDropdown(true)}
                  onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                  placeholder="Destination city"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/80 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white transition-all text-sm focus:outline-none"
                />
              </div>

              {/* City Suggestions Dropdown */}
              {showToDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-2xl z-30 max-h-48 overflow-y-auto">
                  {availableCities
                    .filter(c => c.toLowerCase().includes(toCity.toLowerCase()))
                    .map(city => (
                      <button
                        key={city}
                        onClick={() => {
                          setToCity(city);
                          setShowToDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{city}</span>
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Departure Date */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 block">
                Departure
              </label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/80 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 font-medium text-slate-800 dark:text-white transition-all text-sm focus:outline-none cursor-pointer"
                />
              </div>
            </div>

            {/* Passengers Select */}
            <div className="hidden">
              <input type="hidden" value={passengersCount} />
            </div>

            {/* Find Buses Button */}
            <div className="md:col-span-2">
              <button
                onClick={onSearch}
                className="w-full h-[56px] px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-base transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Find Buses</span>
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

          </div>

          {/* Quick Popular Chips */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-2">Popular:</span>
            <button
              onClick={() => handleQuickSelect('New York, NY', 'Boston, MA')}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium transition-colors"
            >
              New York → Boston
            </button>
            <button
              onClick={() => handleQuickSelect('New York, NY', 'Washington, DC')}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium transition-colors"
            >
              New York → Washington DC
            </button>
            <button
              onClick={() => handleQuickSelect('San Francisco, CA', 'Los Angeles, CA')}
              className="text-xs px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-medium transition-colors hidden sm:inline-block"
            >
              San Francisco → Los Angeles
            </button>
          </div>

        </motion.div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Instant Lock</p>
              <p className="text-[11px] text-slate-400">Real-time seat holds</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">99.4% Punctual</p>
              <p className="text-[11px] text-slate-400">Guaranteed departure</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">500k+ Travelers</p>
              <p className="text-[11px] text-slate-400">4.9/5 star average</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Digital Tickets</p>
              <p className="text-[11px] text-slate-400">Mobile QR Boarding</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
