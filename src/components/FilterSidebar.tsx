import React from 'react';
import { FilterState, BusType } from '../types';
import { Filter, RotateCcw, DollarSign, Clock, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableOperators: string[];
  availableAmenities: string[];
  onReset: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  availableOperators,
  availableAmenities,
  onReset
}) => {
  const busTypesList: BusType[] = [
    'AC Sleeper',
    'Luxury AC Seater',
    'Executive Double Decker',
    'Electric Supercoach',
    'Non-AC Sleeper'
  ];

  const handleBusTypeToggle = (type: BusType) => {
    setFilters(prev => {
      const exists = prev.busTypes.includes(type);
      return {
        ...prev,
        busTypes: exists ? prev.busTypes.filter(t => t !== type) : [...prev.busTypes, type]
      };
    });
  };

  const handleTimeToggle = (timeSlot: 'morning' | 'afternoon' | 'evening' | 'night') => {
    setFilters(prev => {
      const exists = prev.departureTimes.includes(timeSlot);
      return {
        ...prev,
        departureTimes: exists ? prev.departureTimes.filter(t => t !== timeSlot) : [...prev.departureTimes, timeSlot]
      };
    });
  };

  const handleOperatorToggle = (operator: string) => {
    setFilters(prev => {
      const exists = prev.operators.includes(operator);
      return {
        ...prev,
        operators: exists ? prev.operators.filter(o => o !== operator) : [...prev.operators, operator]
      };
    });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base font-display">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Filter Buses</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="departure_asc">Earliest Departure</option>
          <option value="rating_desc">Highest Rated Operator</option>
          <option value="duration_asc">Shortest Travel Duration</option>
        </select>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            Max Fare
          </label>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            ${filters.priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="20"
          max="120"
          step="5"
          value={filters.priceRange[1]}
          onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>$20</span>
          <span>$120</span>
        </div>
      </div>

      {/* Departure Time Slots */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          Departure Time
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'morning', label: 'Morning', sub: '06:00 - 12:00' },
            { id: 'afternoon', label: 'Afternoon', sub: '12:00 - 18:00' },
            { id: 'evening', label: 'Evening', sub: '18:00 - 23:00' },
            { id: 'night', label: 'Night', sub: '23:00 - 06:00' }
          ].map(slot => {
            const isSelected = filters.departureTimes.includes(slot.id as any);
            return (
              <button
                key={slot.id}
                onClick={() => handleTimeToggle(slot.id as any)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-bold'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-semibold">{slot.label}</div>
                <div className="text-[10px] text-slate-400 font-normal">{slot.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bus Class / Type */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          Bus Type
        </label>
        <div className="space-y-2">
          {busTypesList.map(type => {
            const checked = filters.busTypes.includes(type);
            return (
              <label 
                key={type} 
                className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleBusTypeToggle(type)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600"
                />
                <span>{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bus Operators */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          Operator
        </label>
        <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
          {availableOperators.map(op => {
            const checked = filters.operators.includes(op);
            return (
              <label 
                key={op} 
                className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleOperatorToggle(op)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600"
                />
                <span>{op}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2.5">
          Amenities
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableAmenities.map(amenity => {
            const isSelected = filters.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                onClick={() => handleAmenityToggle(amenity)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
