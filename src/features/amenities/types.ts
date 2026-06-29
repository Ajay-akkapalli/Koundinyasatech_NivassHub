export type AmenityStatus = 'Available' | 'Under Maintenance' | 'Booked';

export interface AmenityBooking {
  date: string;
  flat: string;
  purpose: string;
  time: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
  status: AmenityStatus;
  capacity: number;
  timings: string;
  bookingRequired: boolean;
  description: string;
  facilities: string[];
  bookingFee: number;
  maintenanceDay: string;
  currentBookings: AmenityBooking[];
}
