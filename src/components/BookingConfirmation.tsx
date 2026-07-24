import React, { useEffect } from 'react';
import { Booking } from '../types';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Calendar, Share2, Ticket, MapPin, Bus, Clock, ShieldCheck, Printer } from 'lucide-react';
import { motion } from 'motion/react';

interface BookingConfirmationProps {
  booking: Booking;
  onViewAllBookings: () => void;
  onBookNew: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  booking,
  onViewAllBookings,
  onBookNew
}) => {
  const { schedule, pnr, seats, passengers, boardingPoint, droppingPoint, totalFare } = booking;

  // Trigger confetti burst on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore if confetti fails
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`VeloBus Trip: ${schedule.route.fromCity} to ${schedule.route.toCity}`);
    const details = encodeURIComponent(`PNR: ${pnr} | Seats: ${seats.join(', ')} | Boarding at ${boardingPoint.location}`);
    const location = encodeURIComponent(boardingPoint.address);
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `VeloBus Ticket - PNR ${pnr}`,
        text: `I'm traveling from ${schedule.route.fromCity} to ${schedule.route.toCity} on ${schedule.date}! PNR: ${pnr}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`VeloBus Ticket PNR: ${pnr}`);
      alert('Ticket PNR copied to clipboard!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      
      {/* Animated Checkmark Banner */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-3"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Booking Confirmed!
        </h2>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Your e-ticket has been issued and sent to <span className="font-bold text-indigo-600 dark:text-indigo-400">{booking.userEmail}</span>.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
          <span>PNR Number:</span>
          <span className="font-mono text-sm tracking-wider text-indigo-600 dark:text-indigo-400">{pnr}</span>
        </div>
      </motion.div>

      {/* Digital Printable E-Ticket Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xl overflow-hidden print:shadow-none"
      >
        {/* Ticket Top Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-500 text-white p-6 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <Bus className="w-6 h-6" />
              <div>
                <h3 className="font-bold text-lg font-display">{schedule.bus.operator}</h3>
                <p className="text-xs text-indigo-100">{schedule.bus.type} ({schedule.bus.busNumber})</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200 block">Status</span>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-bold text-xs">
                CONFIRMED
              </span>
            </div>
          </div>
        </div>

        {/* Ticket Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Route & Timing Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60 items-center">
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Departure</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-display">{schedule.departureTime}</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{schedule.route.fromCity}</p>
              <p className="text-[11px] text-slate-400">{schedule.date}</p>
            </div>

            <div className="text-center py-2 sm:py-0">
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 block">{schedule.route.durationHours}</span>
              <div className="w-24 mx-auto h-0.5 bg-gradient-to-r from-indigo-500 to-teal-400 my-1 relative">
                <div className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1/2 left-0 -translate-y-1/2" />
                <div className="w-2 h-2 rounded-full bg-teal-400 absolute top-1/2 right-0 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-slate-400">Direct Express</span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Arrival</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-display">{schedule.arrivalTime}</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{schedule.route.toCity}</p>
              <p className="text-[11px] text-slate-400">{schedule.date}</p>
            </div>
          </div>

          {/* Passenger & Seat Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Passengers & Seats
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {passengers.map(p => (
                  <li key={p.seatNo} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                    <span className="font-semibold">{p.name} ({p.gender.toUpperCase()}, {p.age} yrs)</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                      Seat {p.seatNo}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Boarding Point Info */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Boarding Location
              </h4>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{boardingPoint.location}</span>
                </p>
                <p className="text-slate-500 pl-4">{boardingPoint.address}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold pl-4">Reporting Time: 15 mins prior ({schedule.departureTime})</p>
              </div>
            </div>
          </div>

          {/* QR Code & Barcode Verification */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Total Fare Paid
              </span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-display">
                ${totalFare.toFixed(2)}
              </p>
              <p className="text-[10px] text-slate-400">Payment ID: {booking.id}</p>
            </div>

            {/* SVG QR Code Simulation */}
            <div className="text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                {/* SVG QR Code Graphic */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="#fff" />
                  <path d="M10 10h30v30h-30zM55 10h35v35h-35zM10 55h35v35h-35z" fill="#000" />
                  <path d="M18 18h14v14h-14zM63 18h19v19h-19zM18 63h19v19h-19z" fill="#fff" />
                  <path d="M50 50h10v10h-10zM70 50h20v10h-20zM50 70h15v20h-15zM75 75h15v15h-15z" fill="#000" />
                </svg>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">
                SCAN TO BOARD
              </span>
            </div>
          </div>

        </div>

      </motion.div>

      {/* Action CTA Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Ticket</span>
        </button>

        <button
          onClick={handleAddToCalendar}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span>Add to Calendar</span>
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-700"
        >
          <Share2 className="w-4 h-4 text-teal-500" />
          <span>Share Ticket</span>
        </button>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onBookNew}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          ← Book Another Journey
        </button>

        <button
          onClick={onViewAllBookings}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          View All My Bookings →
        </button>
      </div>

    </div>
  );
};
