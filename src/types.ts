export type BusType = 'AC Sleeper' | 'Luxury AC Seater' | 'Executive Double Decker' | 'Non-AC Sleeper' | 'Electric Supercoach';

export type SeatStatus = 'available' | 'selected' | 'booked' | 'locked' | 'ladies';

export type PaymentMethod = 'card' | 'applepay' | 'googlepay' | 'bkash' | 'paypal';

export interface Passenger {
  seatNo: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface BoardingDroppingPoint {
  id: string;
  location: string;
  address: string;
  time: string;
}

export interface Bus {
  id: string;
  operator: string;
  busNumber: string;
  type: BusType;
  totalSeats: number;
  isDoubleDecker?: boolean;
  deckType?: 'single' | 'double'; // lower & upper deck for sleepers
  amenities: string[];
  rating: number;
  reviewsCount: number;
  image: string;
}

export interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  distanceKm: number;
  durationHours: string;
  popular: boolean;
  startingPrice: number;
  image: string;
}

export interface SeatInfo {
  seatNo: string;
  deck?: 'lower' | 'upper';
  row: number;
  col: number; // 1, 2, 3, 4
  type: 'seater' | 'sleeper';
  isWindow: boolean;
  isAisle: boolean;
  price: number;
  isLadiesOnly?: boolean;
}

export interface Schedule {
  id: string;
  busId: string;
  bus: Bus;
  routeId: string;
  route: Route;
  departureTime: string; // ISO or "22:00"
  arrivalTime: string;   // ISO or "06:30"
  date: string;          // YYYY-MM-DD
  baseFare: number;
  availableSeatsCount: number;
  bookedSeatNumbers: string[];
  ladiesSeatNumbers: string[];
  lockedSeatNumbers: string[]; // seat numbers temporarily held
  boardingPoints: BoardingDroppingPoint[];
  droppingPoints: BoardingDroppingPoint[];
}

export interface Booking {
  id: string;
  pnr: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  scheduleId: string;
  schedule: Schedule;
  seats: string[];
  passengers: Passenger[];
  boardingPoint: BoardingDroppingPoint;
  droppingPoint: BoardingDroppingPoint;
  baseFare: number;
  taxAmount: number;
  convenienceFee: number;
  discountAmount: number;
  promoCode?: string;
  totalFare: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingStatus: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  savedPassengers?: Omit<Passenger, 'seatNo'>[];
  avatar?: string;
}

export interface Coupon {
  code: string;
  discountPercent?: number;
  flatDiscount?: number;
  maxDiscount?: number;
  minSpend: number;
  validUntil: string;
  description: string;
}

export interface FilterState {
  busTypes: BusType[];
  departureTimes: ('morning' | 'afternoon' | 'evening' | 'night')[];
  operators: string[];
  amenities: string[];
  priceRange: [number, number];
  sortBy: 'price_asc' | 'price_desc' | 'departure_asc' | 'rating_desc' | 'duration_asc';
}

export interface AdminStats {
  totalRevenue: number;
  totalBookings: number;
  totalBuses: number;
  activeRoutes: number;
  averageOccupancy: number;
  recentBookings: Booking[];
  popularRoutesStats: { routeName: string; bookingsCount: number; revenue: number }[];
  dailyRevenue: { date: string; revenue: number; bookings: number }[];
}
