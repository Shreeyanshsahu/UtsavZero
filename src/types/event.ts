
export interface Event {
  id: string;
  title: string;
  description: string;

  category: string[];

  image: string;

  venue: string;
  address: string;
  city: string;

  latitude: number;
  longitude: number;

  startDate: string;
  endDate: string;

  totalSeats: number;
  bookedSeats: number;

  price: number;

  isFirecrackerFree: boolean;
  isFamilyFriendly: boolean;
}
