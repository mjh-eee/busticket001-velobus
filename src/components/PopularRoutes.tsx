import React from 'react';
import { Route } from '../types';
import { MapPin, ArrowRight, Star, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PopularRoutesProps {
  routes: Route[];
  onSelectRoute: (route: Route) => void;
}

export const PopularRoutes: React.FC<PopularRoutesProps> = ({ routes, onSelectRoute }) => {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-bold mb-3">
              <Star className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600 dark:fill-indigo-400 dark:text-indigo-400" />
              <span>Trending Intercity Express</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Popular Express Routes
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Top requested daily luxury express schedules with real-time seat availability.
            </p>
          </div>
        </div>

        {/* Route Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelectRoute(route)}
              className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Route Image Banner */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={route.image}
                  alt={`${route.fromCity} to ${route.toCity}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                {/* Popular Tag */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase shadow-sm">
                  Daily Express
                </span>

                {/* Price Tag */}
                <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white font-bold text-sm flex items-center gap-1.5 shadow-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-normal">From</span>
                  <span className="text-cyan-400 font-extrabold text-base">${route.startingPrice}</span>
                </div>

                {/* Cities Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{route.durationHours}</span>
                    <span className="text-slate-500">•</span>
                    <span>{route.distanceKm} km</span>
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between text-slate-900 dark:text-white font-bold text-lg">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>{route.fromCity.split(',')[0]}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span>{route.toCity.split(',')[0]}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Free Cancellation
                  </span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1">
                    Book Now →
                  </span>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
