import React from 'react';
import { Star, ShieldCheck, Bus, Award, ThumbsUp, Users, CheckCircle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const testimonials = [
    {
      id: 't1',
      name: 'Dr. Elena Rostova',
      role: 'Frequent Commuter (NYC → Boston)',
      rating: 5,
      comment: 'The double-decker sleeper bus was spotlessly clean and super quiet. Locking my upper deck berth in real-time made the booking stress-free.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 't2',
      name: 'Marcus Brody',
      role: 'Tech Consultant',
      rating: 5,
      comment: 'VeloBus is hands-down the fastest booking app. The live GPS link on my digital ticket let my family track my arrival in real-time.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
    },
    {
      id: 't3',
      name: 'Amina Al-Mansoor',
      role: 'University Student',
      rating: 5,
      comment: 'I really appreciated the ladies-only seat filter feature. Felt super secure, and boarding with the mobile QR code was seamless.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    }
  ];

  const operators = [
    'AeroGlide Express',
    'VeloX Premium',
    'Horizon Royal Coach',
    'Starlight Sleepers',
    'CrossCountry Shuttle',
    'EcoMotion Electric'
  ];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Operators Strip */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-5">
            Partnered with North America's Top Premium Operators
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {operators.map((op) => (
              <div key={op} className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/80 shadow-sm">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span>{op}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Trusted by Over 500,000 Travelers
          </h2>
          <p className="text-slate-400 text-base mt-2">
            Read verified reviews from passengers who travel with VeloBus daily.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-700/60">
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-10 h-10 rounded-full object-cover border border-slate-600"
                />
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    {item.name}
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <p className="text-[11px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
