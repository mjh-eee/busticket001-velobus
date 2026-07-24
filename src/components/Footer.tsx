import React from 'react';
import { Bus, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                <Bus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-bold text-white font-display">Velo<span className="text-indigo-500">Bus</span></span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Premium intercity bus ticket booking engine with real-time seat locks, instant QR e-tickets, and live GPS tracking.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>256-Bit SSL Encrypted Security</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Popular Routes</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">New York to Boston Bus</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">New York to Washington DC</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">San Francisco to Los Angeles</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Chicago to Detroit Express</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Miami to Atlanta Sleeper</a></li>
            </ul>
          </div>

          {/* Amenities & Fleet */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Fleet & Services</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Double-Decker Luxury Sleepers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Electric Supercoaches</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Ladies-Only Seat Reserves</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Operator Analytics Portal</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Corporate Bus Passes</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">24/7 Support</h4>
            <p className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-indigo-400" />
              <span>+1 (800) 555-VELO</span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>support@velobus.express</span>
            </p>
            <p className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>450 Lexington Ave, New York, NY</span>
            </p>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 VeloBus Express Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Refund Guidelines</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
