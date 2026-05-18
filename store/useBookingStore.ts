import { create } from 'zustand'

// Backend'den (Prisma'dan) gelecek olan temel tiplerimiz
interface Location {
  id: string;
  name: string;
  type: string;
}

interface Vehicle {
  id: string;
  name: string;
  passengerCapacity: number; // Prisma ile uyumlu hale getirildi (camelCase)
  luggageCapacity: number;   // Prisma ile uyumlu hale getirildi (camelCase)
  imageUrl?: string | null;  // Prisma'da var olduğu için eklendi
}

// Zustand Store'umuzun (Hafızamızın) içereceği verilerin tipleri
interface BookingState {
  // 1. Adım Verileri: Nereden, Nereye, Tarih
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  pickupDate: string | null;
  
  // 2. Adım Verileri: Seçilen Araç, Rota ve Fiyat
  selectedVehicle: Vehicle | null;
  routeId: string | null;    // Backend'e rezervasyon atarken bu çok önemli olacak
  totalPrice: number | null; // Fiyat araca değil rotaya bağlı olduğu için buraya taşındı
  
  // 3. Adım Verileri: Müşteri Bilgileri
  customerInfo: {
    fullName: string;
    phone: string;
    email: string;
    flightNumber?: string;
    note?: string;
  };

  // Aksiyonlar (Verileri güncellemek için kullanacağımız fonksiyonlar)
  setLocations: (pickup: Location, dropoff: Location) => void;
  setDate: (date: string) => void;
  
  // Araç seçildiğinde fiyatı ve rota id'sini de hafızaya alıyoruz
  setVehicleSelection: (vehicle: Vehicle, routeId: string, price: number) => void; 
  
  setCustomerInfo: (info: Partial<BookingState['customerInfo']>) => void;
}

// Hafızayı oluşturuyoruz
export const useBookingStore = create<BookingState>((set) => ({
  pickupLocation: null,
  dropoffLocation: null,
  pickupDate: null,
  selectedVehicle: null,
  routeId: null,
  totalPrice: null,
  customerInfo: {
    fullName: '',
    phone: '',
    email: '',
    flightNumber: '',
    note: ''
  },

  setLocations: (pickup, dropoff) => set({ pickupLocation: pickup, dropoffLocation: dropoff }),
  setDate: (date) => set({ pickupDate: date }),
  
  setVehicleSelection: (vehicle, routeId, price) => set({ 
    selectedVehicle: vehicle,
    routeId: routeId,
    totalPrice: price 
  }),
  
  setCustomerInfo: (info) => set((state) => ({ 
    customerInfo: { ...state.customerInfo, ...info } 
  })),
}));