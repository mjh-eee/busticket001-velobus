import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_BUSES, INITIAL_ROUTES, INITIAL_COUPONS, MOCK_USER, generateSchedules } from './server/seedData.js';
import { Booking, Schedule, Bus, Route, Coupon, AdminStats } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// State storage
let buses: Bus[] = [...INITIAL_BUSES];
let routes: Route[] = [...INITIAL_ROUTES];
let schedules: Schedule[] = generateSchedules(routes, buses);
let coupons: Coupon[] = [...INITIAL_COUPONS];
let currentUser = { ...MOCK_USER };
let bookings: Booking[] = [
  {
    id: 'bkg-9901',
    pnr: 'VB-882190',
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    userPhone: currentUser.phone || '+1 (555) 234-5678',
    scheduleId: schedules[0]?.id || 'sch-1',
    schedule: schedules[0],
    seats: ['L3', 'L4'],
    passengers: [
      { seatNo: 'L3', name: 'Alex Vance', age: 29, gender: 'male' },
      { seatNo: 'L4', name: 'Sarah Vance', age: 27, gender: 'female' }
    ],
    boardingPoint: schedules[0]?.boardingPoints[0] || { id: 'bp1', location: 'Port Authority', address: '42nd St', time: '08:00' },
    droppingPoint: schedules[0]?.droppingPoints[0] || { id: 'dp1', location: 'South Station', address: 'Atlantic Ave', time: '12:15' },
    baseFare: 76,
    taxAmount: 7.6,
    convenienceFee: 4.0,
    discountAmount: 15.2,
    promoCode: 'VELO20',
    totalFare: 72.4,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'bkg-9902',
    pnr: 'VB-310492',
    userId: currentUser.id,
    userName: currentUser.name,
    userEmail: currentUser.email,
    userPhone: currentUser.phone || '+1 (555) 234-5678',
    scheduleId: schedules[3]?.id || 'sch-4',
    schedule: schedules[3],
    seats: ['U1'],
    passengers: [
      { seatNo: 'U1', name: 'Alex Vance', age: 29, gender: 'male' }
    ],
    boardingPoint: schedules[3]?.boardingPoints[0] || { id: 'bp1', location: 'Port Authority', address: '42nd St', time: '13:00' },
    droppingPoint: schedules[3]?.droppingPoints[0] || { id: 'dp1', location: 'Union Station', address: 'Massachusetts Ave', time: '17:30' },
    baseFare: 42,
    taxAmount: 4.2,
    convenienceFee: 3.0,
    discountAmount: 0,
    totalFare: 49.2,
    paymentMethod: 'applepay',
    paymentStatus: 'paid',
    bookingStatus: 'confirmed',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

// Active seat lock timer map: key = scheduleId + ':' + seatNo, value = timestamp
const activeSeatLocks = new Map<string, { userId: string; expiresAt: number }>();

function cleanupLocks() {
  const now = Date.now();
  for (const [key, val] of activeSeatLocks.entries()) {
    if (val.expiresAt < now) {
      activeSeatLocks.delete(key);
    }
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  
  // 1. Get all cities & routes
  app.get('/api/routes', (req, res) => {
    res.json({ routes, popularRoutes: routes.filter(r => r.popular) });
  });

  // 2. Search schedules
  app.get('/api/schedules', (req, res) => {
    cleanupLocks();
    const { from, to, date, passengers } = req.query;

    let filtered = [...schedules];

    if (from && typeof from === 'string' && from.trim() !== '') {
      filtered = filtered.filter(s => 
        s.route.fromCity.toLowerCase().includes(from.toLowerCase().trim())
      );
    }

    if (to && typeof to === 'string' && to.trim() !== '') {
      filtered = filtered.filter(s => 
        s.route.toCity.toLowerCase().includes(to.toLowerCase().trim())
      );
    }

    if (date && typeof date === 'string' && date.trim() !== '') {
      filtered = filtered.filter(s => s.date === date.trim());
    }

    // Attach real-time locked seat count
    const result = filtered.map(sch => {
      const lockedForSchedule = Array.from(activeSeatLocks.entries())
        .filter(([k]) => k.startsWith(`${sch.id}:`))
        .map(([k]) => k.split(':')[1]);
      
      return {
        ...sch,
        lockedSeatNumbers: lockedForSchedule,
        availableSeatsCount: sch.bus.totalSeats - sch.bookedSeatNumbers.length - lockedForSchedule.length
      };
    });

    res.json({ schedules: result });
  });

  // 3. Get single schedule details
  app.get('/api/schedules/:id', (req, res) => {
    cleanupLocks();
    const schedule = schedules.find(s => s.id === req.params.id);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    const lockedForSchedule = Array.from(activeSeatLocks.entries())
      .filter(([k]) => k.startsWith(`${schedule.id}:`))
      .map(([k]) => k.split(':')[1]);

    res.json({
      schedule: {
        ...schedule,
        lockedSeatNumbers: lockedForSchedule,
        availableSeatsCount: schedule.bus.totalSeats - schedule.bookedSeatNumbers.length - lockedForSchedule.length
      }
    });
  });

  // 4. Temporary Seat Lock
  app.post('/api/seats/lock', (req, res) => {
    cleanupLocks();
    const { scheduleId, seatNo, userId, action } = req.body;

    if (!scheduleId || !seatNo) {
      return res.status(400).json({ error: 'Missing scheduleId or seatNo' });
    }

    const lockKey = `${scheduleId}:${seatNo}`;
    const schedule = schedules.find(s => s.id === scheduleId);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    if (schedule.bookedSeatNumbers.includes(seatNo)) {
      return res.status(400).json({ error: 'Seat is already booked' });
    }

    if (action === 'unlock') {
      activeSeatLocks.delete(lockKey);
      return res.json({ success: true, message: 'Seat unlocked' });
    }

    const existingLock = activeSeatLocks.get(lockKey);
    if (existingLock && existingLock.userId !== userId && existingLock.expiresAt > Date.now()) {
      return res.status(409).json({ error: 'Seat is currently locked by another user' });
    }

    // Lock seat for 10 minutes (600,000 ms)
    const expiresAt = Date.now() + 10 * 60 * 1000;
    activeSeatLocks.set(lockKey, { userId: userId || currentUser.id, expiresAt });

    res.json({
      success: true,
      message: 'Seat locked for 10 minutes',
      expiresAt,
      seatNo
    });
  });

  // 5. Coupon validation
  app.post('/api/coupons/validate', (req, res) => {
    const { code, amount } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required' });

    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return res.status(404).json({ error: 'Invalid promo code' });
    }

    if (amount && amount < found.minSpend) {
      return res.status(400).json({ error: `Minimum booking amount for code ${found.code} is $${found.minSpend}` });
    }

    let discount = 0;
    if (found.flatDiscount) {
      discount = found.flatDiscount;
    } else if (found.discountPercent) {
      discount = (amount * found.discountPercent) / 100;
      if (found.maxDiscount && discount > found.maxDiscount) {
        discount = found.maxDiscount;
      }
    }

    res.json({
      valid: true,
      coupon: found,
      discountAmount: Math.round(discount * 100) / 100
    });
  });

  // 6. Create booking
  app.post('/api/bookings', (req, res) => {
    cleanupLocks();
    const {
      scheduleId,
      seats,
      passengers,
      boardingPoint,
      droppingPoint,
      promoCode,
      paymentMethod,
      user
    } = req.body;

    if (!scheduleId || !seats || !seats.length || !passengers || !passengers.length) {
      return res.status(400).json({ error: 'Incomplete booking details provided' });
    }

    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    // Check if any requested seat is already booked
    const conflict = seats.find((st: string) => schedule.bookedSeatNumbers.includes(st));
    if (conflict) {
      return res.status(400).json({ error: `Seat ${conflict} is already booked. Please choose another seat.` });
    }

    // Calculate fare
    const perSeatFare = schedule.baseFare;
    const baseTotal = perSeatFare * seats.length;
    let discount = 0;

    if (promoCode) {
      const foundCp = coupons.find(c => c.code.toUpperCase() === promoCode.trim().toUpperCase());
      if (foundCp && baseTotal >= foundCp.minSpend) {
        if (foundCp.flatDiscount) discount = foundCp.flatDiscount;
        else if (foundCp.discountPercent) {
          discount = (baseTotal * foundCp.discountPercent) / 100;
          if (foundCp.maxDiscount && discount > foundCp.maxDiscount) discount = foundCp.maxDiscount;
        }
      }
    }

    const taxAmount = Math.round(baseTotal * 0.08 * 100) / 100; // 8% tax
    const convenienceFee = Math.round(seats.length * 2.50 * 100) / 100; // $2.50 per seat fee
    const finalFare = Math.round((baseTotal + taxAmount + convenienceFee - discount) * 100) / 100;

    // Generate PNR
    const pnr = `VB-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      pnr,
      userId: user?.id || currentUser.id,
      userName: user?.name || currentUser.name,
      userEmail: user?.email || currentUser.email,
      userPhone: user?.phone || currentUser.phone || '+1 (555) 000-1122',
      scheduleId: schedule.id,
      schedule,
      seats,
      passengers,
      boardingPoint: boardingPoint || schedule.boardingPoints[0],
      droppingPoint: droppingPoint || schedule.droppingPoints[0],
      baseFare: baseTotal,
      taxAmount,
      convenienceFee,
      discountAmount: Math.round(discount * 100) / 100,
      promoCode,
      totalFare: finalFare,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Update schedule booked seats
    schedule.bookedSeatNumbers = [...schedule.bookedSeatNumbers, ...seats];
    schedule.availableSeatsCount = schedule.bus.totalSeats - schedule.bookedSeatNumbers.length;

    // Release seat locks for these seats
    seats.forEach((st: string) => {
      activeSeatLocks.delete(`${scheduleId}:${st}`);
    });

    bookings.unshift(newBooking);

    res.status(201).json({
      success: true,
      booking: newBooking
    });
  });

  // 7. Get booking by PNR or ID
  app.get('/api/bookings/:identifier', (req, res) => {
    const { identifier } = req.params;
    const found = bookings.find(b => b.pnr.toLowerCase() === identifier.toLowerCase() || b.id === identifier);
    if (!found) {
      return res.status(404).json({ error: 'Ticket booking not found' });
    }
    res.json({ booking: found });
  });

  // 8. User bookings
  app.get('/api/user/bookings', (req, res) => {
    const userBkgs = bookings.filter(b => b.userId === currentUser.id);
    res.json({ bookings: userBkgs });
  });

  // 9. Cancel booking
  app.post('/api/bookings/:id/cancel', (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';

    // Release seats on schedule
    const schedule = schedules.find(s => s.id === booking.scheduleId);
    if (schedule) {
      schedule.bookedSeatNumbers = schedule.bookedSeatNumbers.filter(st => !booking.seats.includes(st));
      schedule.availableSeatsCount = schedule.bus.totalSeats - schedule.bookedSeatNumbers.length;
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund of 90% processed to original payment method.',
      refundAmount: Math.round(booking.totalFare * 0.9 * 100) / 100,
      booking
    });
  });

  // 10. Admin analytics
  app.get('/api/admin/stats', (req, res) => {
    const activeBookings = bookings.filter(b => b.bookingStatus === 'confirmed');
    const totalRevenue = activeBookings.reduce((acc, b) => acc + b.totalFare, 0);

    // Calculate route popularity
    const routeStatsMap = new Map<string, { bookingsCount: number; revenue: number }>();
    activeBookings.forEach(b => {
      const routeName = `${b.schedule.route.fromCity} → ${b.schedule.route.toCity}`;
      const existing = routeStatsMap.get(routeName) || { bookingsCount: 0, revenue: 0 };
      routeStatsMap.set(routeName, {
        bookingsCount: existing.bookingsCount + 1,
        revenue: existing.revenue + b.totalFare
      });
    });

    const popularRoutesStats = Array.from(routeStatsMap.entries()).map(([routeName, data]) => ({
      routeName,
      bookingsCount: data.bookingsCount,
      revenue: Math.round(data.revenue)
    }));

    // Daily revenue mock trend
    const dailyRevenue = [
      { date: 'Mon', revenue: 1420, bookings: 28 },
      { date: 'Tue', revenue: 1890, bookings: 36 },
      { date: 'Wed', revenue: 2310, bookings: 44 },
      { date: 'Thu', revenue: 2950, bookings: 52 },
      { date: 'Fri', revenue: 4100, bookings: 78 },
      { date: 'Sat', revenue: 4890, bookings: 92 },
      { date: 'Sun', revenue: 3800, bookings: 71 }
    ];

    const stats: AdminStats = {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalBookings: activeBookings.length,
      totalBuses: buses.length,
      activeRoutes: routes.length,
      averageOccupancy: 82.4,
      recentBookings: bookings.slice(0, 10),
      popularRoutesStats,
      dailyRevenue
    };

    res.json({ stats, buses, routes, schedules });
  });

  // 11. Add new bus or schedule (Admin)
  app.post('/api/admin/schedules', (req, res) => {
    const { busId, routeId, departureTime, arrivalTime, date, baseFare } = req.body;
    const bus = buses.find(b => b.id === busId);
    const route = routes.find(r => r.id === routeId);

    if (!bus || !route) {
      return res.status(400).json({ error: 'Invalid bus or route ID' });
    }

    const newSch: Schedule = {
      id: `sch-${Date.now()}`,
      busId,
      bus,
      routeId,
      route,
      departureTime: departureTime || '10:00',
      arrivalTime: arrivalTime || '14:30',
      date: date || new Date().toISOString().split('T')[0],
      baseFare: Number(baseFare) || route.startingPrice,
      availableSeatsCount: bus.totalSeats,
      bookedSeatNumbers: [],
      ladiesSeatNumbers: ['L1', 'L2'],
      lockedSeatNumbers: [],
      boardingPoints: [
        { id: 'bp-1', location: `${route.fromCity} Main Station`, address: 'Terminal Depot', time: departureTime || '10:00' }
      ],
      droppingPoints: [
        { id: 'dp-1', location: `${route.toCity} Central Station`, address: 'Main Arrival Plaza', time: arrivalTime || '14:30' }
      ]
    };

    schedules.unshift(newSch);
    res.status(201).json({ success: true, schedule: newSch });
  });

  // 12. Current User Profile
  app.get('/api/user', (req, res) => {
    res.json({ user: currentUser });
  });

  app.put('/api/user/passengers', (req, res) => {
    const { savedPassengers } = req.body;
    if (Array.isArray(savedPassengers)) {
      currentUser.savedPassengers = savedPassengers;
    }
    res.json({ user: currentUser });
  });


  // Serve frontend in production or Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VeloBus Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
