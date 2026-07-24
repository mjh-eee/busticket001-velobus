import React, { useState, useEffect } from 'react';
import { Schedule, SeatInfo } from '../types';
import { Armchair, Check, Lock, User, Clock, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SeatMapProps {
  schedule: Schedule;
  selectedSeats: string[];
  onToggleSeat: (seatNo: string) => void;
  userId: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  schedule,
  selectedSeats,
  onToggleSeat,
  userId
}) => {
  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes timer for active locks

  const { bus } = schedule;
  const isDoubleDecker = bus.deckType === 'double';
  const isSleeper = bus.type.includes('Sleeper');

  // Countdown timer for seat locks
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setTimeLeft(600);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeats]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate 2D seat grid layout mathematically
  const generateSeats = (): SeatInfo[] => {
    const seats: SeatInfo[] = [];
    const seatsPerDeck = isDoubleDecker ? bus.totalSeats / 2 : bus.totalSeats;

    if (isDoubleDecker) {
      // Lower Deck (L1..L15) & Upper Deck (U1..U15)
      ['lower', 'upper'].forEach(deck => {
        const prefix = deck === 'lower' ? 'L' : 'U';
        for (let i = 1; i <= seatsPerDeck; i++) {
          const seatNo = `${prefix}${i}`;
          const isLadies = schedule.ladiesSeatNumbers.includes(seatNo);
          const row = Math.ceil(i / 3);
          const col = ((i - 1) % 3) + 1;

          seats.push({
            seatNo,
            deck: deck as 'lower' | 'upper',
            row,
            col,
            type: 'sleeper',
            isWindow: col === 1 || col === 3,
            isAisle: col === 2,
            price: schedule.baseFare + (deck === 'lower' ? 4 : 0), // lower deck berth premium
            isLadiesOnly: isLadies
          });
        }
      });
    } else {
      // Single Deck 2x2 Seater (S1..S36)
      for (let i = 1; i <= bus.totalSeats; i++) {
        const seatNo = `S${i}`;
        const isLadies = schedule.ladiesSeatNumbers.includes(seatNo);
        const row = Math.ceil(i / 4);
        const col = ((i - 1) % 4) + 1;

        seats.push({
          seatNo,
          deck: 'lower',
          row,
          col,
          type: 'seater',
          isWindow: col === 1 || col === 4,
          isAisle: col === 2 || col === 3,
          price: schedule.baseFare,
          isLadiesOnly: isLadies
        });
      }
    }

    return seats;
  };

  const allSeats = generateSeats();
  const currentDeckSeats = isDoubleDecker
    ? allSeats.filter(s => s.deck === activeDeck)
    : allSeats;

  // Group seats by row
  const rowNumbers = Array.from(new Set(currentDeckSeats.map(s => s.row))).sort((a, b) => a - b);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
      
      {/* Header & Lock Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Armchair className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Select Your Seat</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click available seats to select. Green border indicates window/aisle views.
          </p>
        </div>

        {/* Live Hold Timer */}
        {selectedSeats.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold animate-pulse">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Seats held for {formatTimer(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Deck Selector Tabs for Double Decker */}
      {isDoubleDecker && (
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl max-w-xs mx-auto">
          <button
            onClick={() => setActiveDeck('lower')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeDeck === 'lower'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Lower Deck (Berths)
          </button>
          <button
            onClick={() => setActiveDeck('upper')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeDeck === 'upper'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Upper Deck (Berths)
          </button>
        </div>
      )}

      {/* Color Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px]">
            ✓
          </div>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-slate-300 dark:bg-slate-700 opacity-80" />
          <span className="text-slate-400">Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-pink-100 dark:bg-pink-950/80 border border-pink-400 text-pink-600" />
          <span>Ladies Reserved</span>
        </div>
      </div>

      {/* 2D Bus Chassis Framework */}
      <div className="max-w-md mx-auto relative bg-slate-100 dark:bg-slate-900/90 rounded-3xl p-6 border-2 border-slate-300/80 dark:border-slate-700 shadow-inner">
        
        {/* Front Dashboard / Steering Wheel */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-dashed border-slate-300 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <div className="w-8 h-8 rounded-full border-2 border-slate-400 flex items-center justify-center">
              <span className="text-[10px]">⚙️</span>
            </div>
            <span>Driver's Cockpit</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
            Front
          </span>
        </div>

        {/* Seat Layout Grid */}
        <div className="space-y-3">
          {rowNumbers.map(rowNum => {
            const rowSeats = currentDeckSeats.filter(s => s.row === rowNum);
            
            return (
              <div key={rowNum} className="flex items-center justify-between gap-3">
                
                {/* Left Side Seats (Col 1, 2) */}
                <div className="flex items-center gap-2">
                  {rowSeats.filter(s => s.col <= (isDoubleDecker ? 1 : 2)).map(seat => {
                    const isBooked = schedule.bookedSeatNumbers.includes(seat.seatNo);
                    const isSelected = selectedSeats.includes(seat.seatNo);
                    const isLocked = schedule.lockedSeatNumbers.includes(seat.seatNo);
                    const isLadies = seat.isLadiesOnly;

                    return (
                      <button
                        key={seat.seatNo}
                        disabled={isBooked || isLocked}
                        onClick={() => onToggleSeat(seat.seatNo)}
                        className={`relative group flex flex-col items-center justify-center rounded-xl font-bold transition-all duration-150 cursor-pointer ${
                          isSleeper ? 'w-14 h-11 text-xs' : 'w-11 h-11 text-xs'
                        } ${
                          isBooked
                            ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border-2 border-indigo-400'
                            : isLadies
                            ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-2 border-pink-400/80 hover:bg-pink-100'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md'
                        }`}
                      >
                        <span>{seat.seatNo}</span>
                        <span className="text-[9px] font-medium opacity-80">${seat.price}</span>

                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-400 text-slate-900 flex items-center justify-center text-[10px] font-extrabold shadow">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Aisle */}
                <div className="flex-1 text-center text-[10px] font-semibold text-slate-300 dark:text-slate-700 uppercase tracking-wider">
                  Aisle
                </div>

                {/* Right Side Seats (Col 3, 4) */}
                <div className="flex items-center gap-2">
                  {rowSeats.filter(s => s.col > (isDoubleDecker ? 1 : 2)).map(seat => {
                    const isBooked = schedule.bookedSeatNumbers.includes(seat.seatNo);
                    const isSelected = selectedSeats.includes(seat.seatNo);
                    const isLocked = schedule.lockedSeatNumbers.includes(seat.seatNo);
                    const isLadies = seat.isLadiesOnly;

                    return (
                      <button
                        key={seat.seatNo}
                        disabled={isBooked || isLocked}
                        onClick={() => onToggleSeat(seat.seatNo)}
                        className={`relative group flex flex-col items-center justify-center rounded-xl font-bold transition-all duration-150 cursor-pointer ${
                          isSleeper ? 'w-14 h-11 text-xs' : 'w-11 h-11 text-xs'
                        } ${
                          isBooked
                            ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-700 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border-2 border-indigo-400'
                            : isLadies
                            ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-2 border-pink-400/80 hover:bg-pink-100'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-md'
                        }`}
                      >
                        <span>{seat.seatNo}</span>
                        <span className="text-[9px] font-medium opacity-80">${seat.price}</span>

                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-400 text-slate-900 flex items-center justify-center text-[10px] font-extrabold shadow">
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* Back of Bus */}
        <div className="mt-6 pt-3 text-center border-t border-slate-300 dark:border-slate-700 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
          Back of Bus
        </div>

      </div>

    </div>
  );
};
