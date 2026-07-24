import React from 'react';
import { Search, Armchair, Ticket, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Search Routes & Schedules',
      desc: 'Enter your departure city, destination, and travel date to compare operators, departure times, and pricing.',
      icon: Search,
      badge: 'Real-time Filters'
    },
    {
      step: '02',
      title: 'Choose Seat & Deck',
      desc: 'Pick your preferred seat with our interactive 2D seat map. Choose lower/upper deck berths, ladies-only seats, or window views.',
      icon: Armchair,
      badge: '10-Min Live Seat Hold'
    },
    {
      step: '03',
      title: 'Instant Boarding QR Pass',
      desc: 'Pay securely via credit card, mobile banking, or Apple Pay. Receive a digital ticket with QR code for instant scan-to-board.',
      icon: Ticket,
      badge: '100% Paperless'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Effortless Express Booking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            How VeloBus Works
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base mt-2">
            3 simple steps from route search to digital ticket boarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.step} 
                className="relative bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-3xl font-black text-slate-200 dark:text-slate-700 font-display">
                    {item.step}
                  </span>
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-3">
                  {item.badge}
                </span>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-display">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};
