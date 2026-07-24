import React, { useState, useEffect } from 'react';
import { 
  Bus, Route, Schedule, FilterState, Passenger, BoardingDroppingPoint, 
  Booking, User, AdminStats, PaymentMethod 
} from './types';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { PopularRoutes } from './components/PopularRoutes';
import { HowItWorks } from './components/HowItWorks';
import { TrustSection } from './components/TrustSection';
import { Footer } from './components/Footer';
import { FilterSidebar } from './components/FilterSidebar';
import { BusCard } from './components/BusCard';
import { SeatMap } from './components/SeatMap';
import { FareSummary } from './components/FareSummary';
import { PassengerDetails } from './components/PassengerDetails';
import { CheckoutPayment } from './components/CheckoutPayment';
import { BookingConfirmation } from './components/BookingConfirmation';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Search, Compass, ShieldCheck, Armchair, Bus as BusIcon } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  busTypes: [],
  departureTimes: [],
  operators: [],
  amenities: [],
  priceRange: [20, 120],
  sortBy: 'departure_asc'
};

export default function App() {
  // Navigation & Page Tab State
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'my-bookings' | 'admin'>('home');
  const [bookingStep, setBookingStep] = useState<number>(1); // 1: Search, 2: Seats, 3: Details, 4: Pay, 5: Confirm

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Search parameters
  const [fromCity, setFromCity] = useState('New York, NY');
  const [toCity, setToCity] = useState('Boston, MA');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [passengersCount, setPassengersCount] = useState<number>(1);

  // Data Collections
  const [routes, setRoutes] = useState<Route[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [user, setUser] = useState<User>({
    id: 'usr-101',
    name: 'Alex Vance',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 234-5678',
    role: 'user',
    savedPassengers: [
      { name: 'Alex Vance', age: 29, gender: 'male' },
      { name: 'Sarah Vance', age: 27, gender: 'female' }
    ],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  });
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [allBuses, setAllBuses] = useState<Bus[]>([]);

  // Active Booking Flow State
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [boardingPoint, setBoardingPoint] = useState<BoardingDroppingPoint | null>(null);
  const [droppingPoint, setDroppingPoint] = useState<BoardingDroppingPoint | null>(null);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userPhone, setUserPhone] = useState(user.phone || '');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Loading States
  const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);

  // Synchronize dark mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initial Data Fetching
  useEffect(() => {
    fetchRoutes();
    fetchUser();
    fetchUserBookings();
    fetchAdminStats();
    handleSearchSchedules();
  }, []);

  const fetchRoutes = async () => {
    try {
      const res = await fetch('/api/routes');
      const data = await res.json();
      if (data.routes) {
        setRoutes(data.routes);
        setPopularRoutes(data.popularRoutes || data.routes.filter((r: Route) => r.popular));
      }
    } catch (e) {
      console.error('Failed to fetch routes', e);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setUserEmail(data.user.email);
        setUserPhone(data.user.phone || '');
      }
    } catch (e) {
      console.error('Failed to fetch user', e);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const res = await fetch('/api/user/bookings');
      const data = await res.json();
      if (data.bookings) {
        setUserBookings(data.bookings);
      }
    } catch (e) {
      console.error('Failed to fetch user bookings', e);
    }
  };

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.stats) {
        setAdminStats(data.stats);
        if (data.buses) setAllBuses(data.buses);
      }
    } catch (e) {
      console.error('Failed to fetch admin stats', e);
    }
  };

  // Search Schedules API
  const handleSearchSchedules = async () => {
    setIsLoadingSchedules(true);
    try {
      const query = new URLSearchParams({
        from: fromCity,
        to: toCity,
        date: travelDate,
        passengers: passengersCount.toString()
      });

      const res = await fetch(`/api/schedules?${query.toString()}`);
      const data = await res.json();
      if (data.schedules) {
        setSchedules(data.schedules);
      }
    } catch (e) {
      console.error('Search schedules error', e);
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  // Apply Filters Client-side
  useEffect(() => {
    let result = [...schedules];

    if (filters.busTypes.length > 0) {
      result = result.filter(s => filters.busTypes.includes(s.bus.type));
    }

    if (filters.operators.length > 0) {
      result = result.filter(s => filters.operators.includes(s.bus.operator));
    }

    if (filters.priceRange[1] < 120) {
      result = result.filter(s => s.baseFare <= filters.priceRange[1]);
    }

    if (filters.amenities.length > 0) {
      result = result.filter(s => 
        filters.amenities.every(am => s.bus.amenities.includes(am))
      );
    }

    // Departure Time Slots Filter
    if (filters.departureTimes.length > 0) {
      result = result.filter(s => {
        const hour = parseInt(s.departureTime.split(':')[0]);
        return filters.departureTimes.some(slot => {
          if (slot === 'morning') return hour >= 6 && hour < 12;
          if (slot === 'afternoon') return hour >= 12 && hour < 18;
          if (slot === 'evening') return hour >= 18 && hour < 23;
          if (slot === 'night') return hour >= 23 || hour < 6;
          return true;
        });
      });
    }

    // Sorting
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.baseFare - b.baseFare);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.baseFare - a.baseFare);
    } else if (filters.sortBy === 'departure_asc') {
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } else if (filters.sortBy === 'rating_desc') {
      result.sort((a, b) => b.bus.rating - a.bus.rating);
    }

    setFilteredSchedules(result);
  }, [schedules, filters]);

  // Handle Home Search Trigger
  const handleHeroSearchTrigger = () => {
    setActiveTab('search');
    setBookingStep(1);
    handleSearchSchedules();
  };

  // Handle Popular Route Click
  const handlePopularRouteClick = (route: Route) => {
    setFromCity(route.fromCity);
    setToCity(route.toCity);
    setActiveTab('search');
    setBookingStep(1);
    handleSearchSchedules();
  };

  // Handle Select Bus Schedule
  const handleSelectSchedule = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setSelectedSeats([]);
    setPassengers([]);
    setBoardingPoint(schedule.boardingPoints[0] || null);
    setDroppingPoint(schedule.droppingPoints[0] || null);
    setBookingStep(2); // Move to Seat Selection Step
  };

  // Toggle Seat Selection with Live Lock API
  const handleToggleSeat = async (seatNo: string) => {
    if (!selectedSchedule) return;

    const isAlreadySelected = selectedSeats.includes(seatNo);
    let updatedSeats: string[];

    if (isAlreadySelected) {
      updatedSeats = selectedSeats.filter(s => s !== seatNo);
      // Send unlock API request
      fetch('/api/seats/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleId: selectedSchedule.id, seatNo, action: 'unlock' })
      }).catch(() => {});
    } else {
      updatedSeats = [...selectedSeats, seatNo];
      // Send lock API request
      try {
        const res = await fetch('/api/seats/lock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scheduleId: selectedSchedule.id, seatNo, userId: user.id })
        });
        const lockData = await res.json();
        if (!res.ok) {
          alert(lockData.error || 'Seat lock failed');
          return;
        }
      } catch (e) {
        console.error('Lock error', e);
      }
    }

    setSelectedSeats(updatedSeats);

    // Sync passengers array
    const updatedPassengers: Passenger[] = updatedSeats.map(st => {
      const existing = passengers.find(p => p.seatNo === st);
      if (existing) return existing;

      // Default pre-fill first seat with user name
      const savedP = user.savedPassengers?.[0];
      return {
        seatNo: st,
        name: savedP?.name || (updatedSeats.indexOf(st) === 0 ? user.name : ''),
        age: savedP?.age || 28,
        gender: savedP?.gender || 'male'
      };
    });

    setPassengers(updatedPassengers);
  };

  // Apply Coupon API
  const handleApplyCoupon = async (code: string) => {
    if (!selectedSchedule) return;
    const baseTotal = selectedSchedule.baseFare * selectedSeats.length;

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, amount: baseTotal })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Invalid coupon');
        return;
      }

      setAppliedCoupon(data.coupon.code);
      setDiscountAmount(data.discountAmount);
    } catch (e) {
      console.error('Coupon validation error', e);
    }
  };

  // Confirm Final Booking API
  const handleConfirmBooking = async (paymentMethod: PaymentMethod) => {
    if (!selectedSchedule || !boardingPoint || !droppingPoint) return;

    try {
      const payload = {
        scheduleId: selectedSchedule.id,
        seats: selectedSeats,
        passengers,
        boardingPoint,
        droppingPoint,
        promoCode: appliedCoupon,
        paymentMethod,
        user
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Booking failed');
        return;
      }

      setConfirmedBooking(data.booking);
      setBookingStep(5); // Move to Confirmation Step
      fetchUserBookings();
      fetchAdminStats();
    } catch (e) {
      console.error('Booking submission error', e);
    }
  };

  // Cancel Booking Handler
  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Cancellation failed');
        return;
      }

      alert(data.message);
      fetchUserBookings();
      fetchAdminStats();
    } catch (e) {
      console.error('Cancellation error', e);
    }
  };

  // Save Passengers Handler
  const handleSavePassengers = async (newSavedList: Omit<Passenger, 'seatNo'>[]) => {
    try {
      const res = await fetch('/api/user/passengers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedPassengers: newSavedList })
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error('Save passengers error', e);
    }
  };

  // Add Admin Schedule
  const handleAddSchedule = async (newSch: any) => {
    try {
      const res = await fetch('/api/admin/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSch)
      });
      if (res.ok) {
        handleSearchSchedules();
      }
    } catch (e) {
      console.error('Add schedule error', e);
    }
  };

  const availableCities = Array.from(new Set(routes.flatMap(r => [r.fromCity, r.toCity])));
  const availableOperators = Array.from(new Set(schedules.map(s => s.bus.operator)));
  const availableAmenities = Array.from(new Set(schedules.flatMap(s => s.bus.amenities)));

  // Calculate current total fare
  const currentBaseTotal = selectedSchedule ? selectedSchedule.baseFare * selectedSeats.length : 0;
  const currentTax = Math.round(currentBaseTotal * 0.08 * 100) / 100;
  const currentFee = Math.round(selectedSeats.length * 2.50 * 100) / 100;
  const currentTotalFare = Math.max(0, Math.round((currentBaseTotal + currentTax + currentFee - discountAmount) * 100) / 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 flex flex-col justify-between">
      
      {/* Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'search') setBookingStep(1);
        }}
        user={user}
        stepProgress={activeTab === 'search' ? bookingStep : undefined}
        currentStepName={
          bookingStep === 1 ? 'Search Routes' :
          bookingStep === 2 ? 'Seat Selection' :
          bookingStep === 3 ? 'Passenger Details' :
          bookingStep === 4 ? 'Payment' : 'Ticket Confirmation'
        }
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Main Page Routing Switcher */}
      <main className="flex-1">
        
        {/* TAB 1: HOME LANDING PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-16">
            <HeroSearch
              fromCity={fromCity}
              setFromCity={setFromCity}
              toCity={toCity}
              setToCity={setToCity}
              travelDate={travelDate}
              setTravelDate={setTravelDate}
              passengersCount={passengersCount}
              setPassengersCount={setPassengersCount}
              onSearch={handleHeroSearchTrigger}
              availableCities={availableCities}
            />

            <PopularRoutes
              routes={popularRoutes}
              onSelectRoute={handlePopularRouteClick}
            />

            <HowItWorks />

            <TrustSection />
          </div>
        )}

        {/* TAB 2: SEARCH & BOOKING FLOW */}
        {activeTab === 'search' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* STEP 1: Search Results */}
            {bookingStep === 1 && (
              <div className="space-y-6">
                
                {/* Search Header Bar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                      Available Express Buses
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Showing routes from <strong className="text-indigo-600 dark:text-indigo-400">{fromCity}</strong> to <strong className="text-teal-600 dark:text-teal-400">{toCity}</strong> on <strong>{travelDate}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleSearchSchedules()}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer self-start md:self-auto"
                  >
                    Refresh Real-time Seats
                  </button>
                </div>

                {/* Grid: Filter Sidebar + Bus Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  <div className="lg:col-span-4">
                    <FilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      availableOperators={availableOperators}
                      availableAmenities={availableAmenities}
                      onReset={() => setFilters(DEFAULT_FILTERS)}
                    />
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    {isLoadingSchedules ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(n => (
                          <div key={n} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 animate-pulse space-y-4">
                            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                            <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded w-full" />
                          </div>
                        ))}
                      </div>
                    ) : filteredSchedules.length === 0 ? (
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-700/80">
                        <BusIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <h3 className="font-bold text-slate-800 dark:text-white text-base">
                          No Buses Found for Selection
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                          Try adjusting your filter criteria or change departure dates to see available express options.
                        </p>
                        <button
                          onClick={() => setFilters(DEFAULT_FILTERS)}
                          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    ) : (
                      filteredSchedules.map(sch => (
                        <BusCard
                          key={sch.id}
                          schedule={sch}
                          onSelectSeats={handleSelectSchedule}
                        />
                      ))
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* STEP 2: Interactive Seat Selection */}
            {bookingStep === 2 && selectedSchedule && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                  >
                    ← Back to Bus Results
                  </button>

                  <span className="text-xs text-slate-400">
                    Step 2 of 4: Choose Seats
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <SeatMap
                      schedule={selectedSchedule}
                      selectedSeats={selectedSeats}
                      onToggleSeat={handleToggleSeat}
                      userId={user.id}
                    />
                  </div>

                  <div className="lg:col-span-4">
                    <FareSummary
                      schedule={selectedSchedule}
                      selectedSeats={selectedSeats}
                      appliedCoupon={appliedCoupon}
                      discountAmount={discountAmount}
                      onApplyCoupon={handleApplyCoupon}
                      onProceed={() => setBookingStep(3)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Passenger Details */}
            {bookingStep === 3 && selectedSchedule && (
              <div className="space-y-6">
                <PassengerDetails
                  selectedSeats={selectedSeats}
                  passengers={passengers}
                  setPassengers={setPassengers}
                  schedule={selectedSchedule}
                  boardingPoint={boardingPoint!}
                  setBoardingPoint={setBoardingPoint}
                  droppingPoint={droppingPoint!}
                  setDroppingPoint={setDroppingPoint}
                  userEmail={userEmail}
                  setUserEmail={setUserEmail}
                  userPhone={userPhone}
                  setUserPhone={setUserPhone}
                  user={user}
                  onProceedToPayment={() => setBookingStep(4)}
                  onBack={() => setBookingStep(2)}
                />
              </div>
            )}

            {/* STEP 4: Checkout & Payment */}
            {bookingStep === 4 && selectedSchedule && boardingPoint && droppingPoint && (
              <div className="space-y-6">
                <CheckoutPayment
                  schedule={selectedSchedule}
                  selectedSeats={selectedSeats}
                  passengers={passengers}
                  boardingPoint={boardingPoint}
                  droppingPoint={droppingPoint}
                  totalFare={currentTotalFare}
                  discountAmount={discountAmount}
                  userEmail={userEmail}
                  onConfirmBooking={handleConfirmBooking}
                  onBack={() => setBookingStep(3)}
                />
              </div>
            )}

            {/* STEP 5: Booking Confirmation */}
            {bookingStep === 5 && confirmedBooking && (
              <div className="space-y-6">
                <BookingConfirmation
                  booking={confirmedBooking}
                  onViewAllBookings={() => setActiveTab('my-bookings')}
                  onBookNew={() => {
                    setActiveTab('search');
                    setBookingStep(1);
                  }}
                />
              </div>
            )}

          </div>
        )}

        {/* TAB 3: USER DASHBOARD */}
        {activeTab === 'my-bookings' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <UserDashboard
              user={user}
              bookings={userBookings}
              onCancelBooking={handleCancelBooking}
              onSavePassengers={handleSavePassengers}
              onBookNew={() => {
                setActiveTab('search');
                setBookingStep(1);
              }}
            />
          </div>
        )}

        {/* TAB 4: ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <AdminDashboard
              stats={adminStats}
              buses={allBuses}
              routes={routes}
              schedules={schedules}
              onAddSchedule={handleAddSchedule}
              onRefreshStats={fetchAdminStats}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}
