import React, { useState } from 'react';
import { Schedule } from '../types';
import { Bus, Star, Clock, Wifi, Zap, MapPin, ChevronDown, ChevronUp, ShieldCheck, Armchair, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

interface BusCardProps {
  schedule: Schedule;
  onSelectSeats: (schedule: Schedule) => void;
  isSelected?: boolean;
}

export const BusCard: React.FC<BusCardProps> = ({ schedule, onSelectSeats, isSelected }) => {
  const [showDetails, setShowDetails] = useState(false);

  const { bus, route } = schedule;
  const isSleeper = bus.type.includes('Sleeper');
  const isLowSeats = schedule.availableSeatsCount <= 5;

  return (
    <motion.div 
      layout
      className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-500/20'
          : 'border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Top Header: Operator & Rating */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 p-0.5 overflow-hidden flex-shrink-0 border border-slate-200/60 dark:border-slate-600">
              <img 
                src={bus.image} 
                alt={bus.operator}
                className="w-full h-full object-cover rounded-lg" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-display">
                  {bus.operator}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {bus.busNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">{bus.type}</span>
                <span>•</span>
                <span>{bus.deckType === 'double' ? 'Double Decker' : 'Single Deck'}</span>
              </p>
            </div>
          </div>

          {/* Rating Badge & Seats Left Badge */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{bus.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">({bus.reviewsCount})</span>
            </div>

            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
              isLowSeats 
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
            }`}>
              <Armchair className="w-3.5 h-3.5" />
              <span>{schedule.availableSeatsCount} Seats Left</span>
            </div>
          </div>

        </div>

        {/* Departure, Timeline & Arrival */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Departure */}
          <div className="sm:col-span-3">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {schedule.departureTime}
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>{route.fromCity.split(',')[0]}</span>
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {schedule.boardingPoints[0]?.location || 'Main Express Terminal'}
            </p>
          </div>

          {/* Duration Graphic */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center py-2 sm:py-0">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              <span>{route.durationHours}</span>
            </span>
            <div className="w-full flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-950/50" />
              <div className="flex-1 h-0.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-600 dark:text-slate-300 font-semibold border border-slate-200 dark:border-slate-600">
                  Direct Express
                </div>
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-teal-400 ring-4 ring-teal-100 dark:ring-teal-950/50" />
            </div>
          </div>

          {/* Arrival */}
          <div className="sm:col-span-4 text-left sm:text-right">
            <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {schedule.arrivalTime}
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center sm:justify-end gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-teal-500" />
              <span>{route.toCity.split(',')[0]}</span>
            </p>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {schedule.droppingPoints[0]?.location || 'Central Station'}
            </p>
          </div>

        </div>

        {/* Amenities Bar & Price Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Amenities Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {bus.amenities.slice(0, 4).map((amenity) => (
              <span 
                key={amenity}
                className="text-[10px] font-semibold px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300"
              >
                {amenity}
              </span>
            ))}
            {bus.amenities.length > 4 && (
              <span className="text-[10px] font-semibold text-slate-400">
                +{bus.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Price & Select Seat Button */}
          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Price per seat</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">
                ${schedule.baseFare}
              </span>
            </div>

            <button
              onClick={() => onSelectSeats(schedule)}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 hover:scale-105 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Armchair className="w-4 h-4" />
              <span>{isSelected ? 'Seats Selected' : 'Select Seats'}</span>
            </button>
          </div>

        </div>

        {/* Toggle Boarding/Dropping Points Accordion */}
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{showDetails ? 'Hide Boarding & Dropping Points' : 'View Boarding & Dropping Points'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showDetails && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
            >
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  Boarding Points:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {schedule.boardingPoints.map(bp => (
                    <li key={bp.id} className="flex items-start gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{bp.time}</span> - {bp.location} ({bp.address})
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1">
                  Dropping Points:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {schedule.droppingPoints.map(dp => (
                    <li key={dp.id} className="flex items-start gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{dp.time}</span> - {dp.location} ({dp.address})
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
};
