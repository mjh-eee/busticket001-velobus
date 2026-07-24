import React from 'react';
import { Bus, User as UserIcon, Calendar, Compass, ShieldCheck, Ticket, LayoutDashboard, ChevronDown, Moon, Sun } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'search' | 'my-bookings' | 'admin';
  setActiveTab: (tab: 'home' | 'search' | 'my-bookings' | 'admin') => void;
  user: User;
  stepProgress?: number; // 1: Search, 2: Seats, 3: Details, 4: Pay, 5: Confirm
  currentStepName?: string;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  stepProgress,
  currentStepName,
  isDarkMode,
  setIsDarkMode
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-105 transition-transform duration-200">
              <Bus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white font-display">
                  Velo<span className="text-indigo-600 dark:text-indigo-400">Bus</span>
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                  PRO
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 -mt-0.5 hidden sm:block">
                Premium Travel Redefined
              </p>
            </div>
          </div>

          {/* Progress Indicator when inside Booking Flow */}
          {stepProgress && stepProgress > 1 && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {stepProgress}
                </span>
                <span>{currentStepName || 'Booking'}</span>
              </div>
              <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 transition-all duration-300"
                  style={{ width: `${(stepProgress / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Explore</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'search'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>Search Routes</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'my-bookings'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">My Tickets</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3.5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden md:inline">Operator Portal</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-800">
              <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-100 p-0.5 cursor-pointer shadow-sm">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden lg:inline">
                {user.name.split(' ')[0]}
              </span>
            </div>

          </nav>
        </div>
      </div>
    </header>
  );
};
