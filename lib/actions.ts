// lib/actions.ts
'use server'

import { prisma } from '@/lib/prisma'; // İçe aktarma yolu projenin geneline uygun hale getirildi

// 1. Lokasyonları Getir (Eski Location tablosu yerine Route tablosundan eşsiz olanları çekeriz)
export async function getLocations() {
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true },
      select: { pickup: true, dropoff: true }
    });
    
    // pickup ve dropoff'ları birleştirip tekrar edenleri temizliyoruz
    const uniqueLocations = new Set([
      ...routes.map(r => r.pickup), 
      ...routes.map(r => r.dropoff)
    ]);
    
    return Array.from(uniqueLocations).sort().map(name => ({ name }));
  } catch (error) {
    console.error("Lokasyonlar çekilirken hata oluştu:", error);
    return []; 
  }
}

// 2. Müsait Araçları Getir (Yeni pickup ve dropoff mimarisine göre güncellendi)
export async function getAvailableVehicles(pickupStr: string, dropoffStr: string) {
  try {
    const routes = await prisma.route.findMany({
      where: {
        pickup: pickupStr,
        dropoff: dropoffStr,
        isActive: true
      },
      include: {
        prices: {
          include: { vehicle: true }
        }
      }
    });

    return routes;
  } catch (error) {
    console.error("Araçlar ve rotalar çekilirken hata oluştu:", error);
    return [];
  }
}

// 3. Rezervasyon Oluştur (Yeni Reservation şemasına göre güncellendi)
export async function createReservation(data: {
  routeId: string;
  vehicleId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupDateTime: Date;
  adultCount: number;
  childCount: number;
  totalPrice: number;
  currency: string;
}) {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        pnrCode: `VIP${Math.floor(1000 + Math.random() * 9000)}`, // Örn: VIP4829
        routeId: data.routeId,
        vehicleId: data.vehicleId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        pickupDateTime: data.pickupDateTime,
        adultCount: data.adultCount,
        childCount: data.childCount,
        totalPrice: data.totalPrice,
        currency: data.currency,
        status: "PENDING" 
      }
    });
    return { success: true, reservationId: reservation.id };
  } catch (error) {
    console.error("Rezervasyon kaydedilirken hata:", error);
    return { success: false, error: "Kayıt işlemi başarısız oldu." };
  }
}