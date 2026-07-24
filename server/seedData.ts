import { Bus, Route, Schedule, Coupon, User } from '../src/types.js';

export const INITIAL_BUSES: Bus[] = [
  {
    id: 'bus-1',
    operator: 'AeroGlide Express',
    busNumber: 'AG-9021',
    type: 'AC Sleeper',
    totalSeats: 30,
    isDoubleDecker: true,
    deckType: 'double',
    amenities: ['WiFi', 'Power Outlet', 'Blanket & Pillow', 'Reading Light', 'Water Bottle', 'Live GPS Tracking', 'Onboard Restroom'],
    rating: 4.9,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bus-2',
    operator: 'VeloX Premium Lines',
    busNumber: 'VX-4080',
    type: 'Electric Supercoach',
    totalSeats: 36,
    isDoubleDecker: false,
    deckType: 'single',
    amenities: ['WiFi', 'Power Outlet', 'Reclining Seats', 'Live GPS Tracking', 'Entertainment Screen', 'Water Bottle'],
    rating: 4.8,
    reviewsCount: 980,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bus-3',
    operator: 'Starlight Sleepers',
    busNumber: 'SL-7001',
    type: 'Executive Double Decker',
    totalSeats: 32,
    isDoubleDecker: true,
    deckType: 'double',
    amenities: ['WiFi', 'Power Outlet', 'Blanket & Pillow', 'Reading Light', 'Onboard Restroom', 'Live GPS Tracking'],
    rating: 4.9,
    reviewsCount: 2150,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bus-4',
    operator: 'Horizon Royal Coach',
    busNumber: 'HR-1012',
    type: 'Luxury AC Seater',
    totalSeats: 40,
    isDoubleDecker: false,
    deckType: 'single',
    amenities: ['WiFi', 'Power Outlet', 'Reclining Seats', 'Water Bottle', 'Live GPS Tracking'],
    rating: 4.6,
    reviewsCount: 650,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bus-5',
    operator: 'CrossCountry Shuttle',
    busNumber: 'CC-3320',
    type: 'Non-AC Sleeper',
    totalSeats: 30,
    isDoubleDecker: false,
    deckType: 'single',
    amenities: ['Power Outlet', 'Reading Light', 'Blanket & Pillow'],
    rating: 4.3,
    reviewsCount: 410,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_ROUTES: Route[] = [
  {
    id: 'route-nyc-bos',
    fromCity: 'New York, NY',
    toCity: 'Boston, MA',
    distanceKm: 346,
    durationHours: '4h 15m',
    popular: true,
    startingPrice: 38,
    image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'route-nyc-dc',
    fromCity: 'New York, NY',
    toCity: 'Washington, DC',
    distanceKm: 362,
    durationHours: '4h 30m',
    popular: true,
    startingPrice: 42,
    image: 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'route-bos-nyc',
    fromCity: 'Boston, MA',
    toCity: 'New York, NY',
    distanceKm: 346,
    durationHours: '4h 20m',
    popular: true,
    startingPrice: 38,
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'route-sf-la',
    fromCity: 'San Francisco, CA',
    toCity: 'Los Angeles, CA',
    distanceKm: 615,
    durationHours: '6h 45m',
    popular: true,
    startingPrice: 55,
    image: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'route-chi-det',
    fromCity: 'Chicago, IL',
    toCity: 'Detroit, MI',
    distanceKm: 455,
    durationHours: '5h 10m',
    popular: false,
    startingPrice: 45,
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'route-mia-atl',
    fromCity: 'Miami, FL',
    toCity: 'Atlanta, GA',
    distanceKm: 1060,
    durationHours: '9h 30m',
    popular: true,
    startingPrice: 68,
    image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'VELO20',
    discountPercent: 20,
    maxDiscount: 25,
    minSpend: 30,
    validUntil: '2026-12-31',
    description: 'Get 20% OFF up to $25 on your booking!'
  },
  {
    code: 'FIRSTBUS',
    discountPercent: 15,
    maxDiscount: 20,
    minSpend: 25,
    validUntil: '2026-12-31',
    description: '15% discount for first-time travel bookings.'
  },
  {
    code: 'SUMMER26',
    flatDiscount: 10,
    minSpend: 40,
    validUntil: '2026-12-31',
    description: 'Flat $10 instant discount on orders over $40.'
  }
];

export const MOCK_USER: User = {
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
};

export function generateSchedules(routes: Route[], buses: Bus[]): Schedule[] {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = tomorrowObj.toISOString().split('T')[0];
  const nextDayObj = new Date();
  nextDayObj.setDate(nextDayObj.getDate() + 2);
  const nextDayStr = nextDayObj.toISOString().split('T')[0];

  const dates = [todayStr, tomorrowStr, nextDayStr];
  const times = [
    { dep: '07:00', arr: '11:15' },
    { dep: '09:30', arr: '13:45' },
    { dep: '13:00', arr: '17:20' },
    { dep: '17:30', arr: '21:45' },
    { dep: '22:15', arr: '02:30 (+1)' },
    { dep: '23:30', arr: '03:45 (+1)' }
  ];

  const schedules: Schedule[] = [];
  let idCounter = 1;

  dates.forEach((date) => {
    routes.forEach((route) => {
      // Pick 2-3 buses per route
      buses.forEach((bus, busIdx) => {
        const timeObj = times[(idCounter + busIdx) % times.length];
        
        // Mock some booked and ladies seats
        const booked: string[] = [];
        const ladies: string[] = ['L1', 'L2'];
        const total = bus.totalSeats;
        
        // Populate 8-12 random booked seats
        const numBooked = Math.floor(Math.random() * 8) + 6;
        for (let i = 0; i < numBooked; i++) {
          const seatNum = bus.deckType === 'double'
            ? `${i % 2 === 0 ? 'L' : 'U'}${Math.floor(i / 2) + 3}`
            : `S${i + 4}`;
          if (!booked.includes(seatNum)) booked.push(seatNum);
        }

        schedules.push({
          id: `sch-${idCounter++}`,
          busId: bus.id,
          bus: bus,
          routeId: route.id,
          route: route,
          departureTime: timeObj.dep,
          arrivalTime: timeObj.arr,
          date: date,
          baseFare: route.startingPrice + (bus.type.includes('Sleeper') ? 14 : bus.type.includes('Electric') ? 8 : 0),
          availableSeatsCount: total - booked.length,
          bookedSeatNumbers: booked,
          ladiesSeatNumbers: ladies,
          lockedSeatNumbers: [],
          boardingPoints: [
            { id: 'bp-1', location: `${route.fromCity} Port Authority Terminal`, address: '8th Ave & 42nd St', time: timeObj.dep },
            { id: 'bp-2', location: `${route.fromCity} Uptown Express Station`, address: '178th St & Broadway', time: `${parseInt(timeObj.dep) + 1}:15` }
          ],
          droppingPoints: [
            { id: 'dp-1', location: `${route.toCity} South Central Hub`, address: '700 Atlantic Ave', time: timeObj.arr },
            { id: 'dp-2', location: `${route.toCity} Airport Bus Terminal`, address: 'Terminals 1 & 2 Center', time: `${timeObj.arr} (+15m)` }
          ]
        });
      });
    });
  });

  return schedules;
}
