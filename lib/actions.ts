// lib/actions.ts
'use server'

import { prisma } from './db';

// Veritabanından tüm lokasyonları alfabetik sırayla çeken fonksiyon
export async function getLocations() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' }
    });
    return locations;
  } catch (error) {
    console.error("Lokasyonlar çekilirken hata oluştu:", error);
    return []; // Uygulamanın çökmemesi için hata anında boş dizi dönüyoruz
  }
}

// lib/actions.ts dosyasına ekle

export async function getAvailableVehicles(fromId: string, toId: string) {
  try {
    const routes = await prisma.route.findMany({
      where: {
        fromLocationId: fromId,
        toLocationId: toId,
      },
      include: {
        vehicle: true // Rotaya bağlı araç bilgilerini de getiriyoruz
      }
    });

    // Frontend'in kolayca kullanabileceği bir yapıya dönüştürüp döndürüyoruz
    return routes.map(route => ({
      routeId: route.id,
      priceTRY: route.priceTRY,
      priceEUR: route.priceEUR,
      distance: route.distance,
      duration: route.duration,
      vehicle: route.vehicle
    }));
  } catch (error) {
    console.error("Araçlar ve rotalar çekilirken hata oluştu:", error);
    return [];
  }
}

// lib/actions.ts dosyasının en altına eklenecek

export async function createReservation(data: {
  routeId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  transferDate: Date;
  flightNumber?: string;
  passengers: number;
  pickupAddress?: string;
  dropoffAddress?: string;
  totalPrice: number;
}) {
  try {
    const reservation = await prisma.reservation.create({
      data: {
        routeId: data.routeId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        transferDate: data.transferDate,
        flightNumber: data.flightNumber,
        passengers: data.passengers,
        pickupAddress: data.pickupAddress,
        dropoffAddress: data.dropoffAddress,
        totalPrice: data.totalPrice,
        status: "PENDING" // Varsayılan olarak "Bekliyor" durumunda açılır
      }
    });
    return { success: true, reservationId: reservation.id };
  } catch (error) {
    console.error("Rezervasyon kaydedilirken hata:", error);
    return { success: false, error: "Kayıt işlemi başarısız oldu." };
  }
}