// app/api/client/reservations/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const requestedDate = new Date(body.pickupDateTime);

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        vehicleId: body.vehicleId,
        status: { in: ['PENDING', 'CONFIRMED'] }, 
        busyFrom: { lte: requestedDate }, 
        busyTo: { gte: requestedDate }    
      }
    });

    if (conflictingReservation) {
      return NextResponse.json({
        success: false,
        error: 'Seçtiğiniz araç bu saat aralığında başka bir transfer için doludur. Lütfen farklı bir saat veya araç seçiniz.'
      }, { status: 400 });
    }

    const pricing = await prisma.routePricing.findUnique({
        where: {
            routeId_vehicleId: {
                routeId: body.routeId,
                vehicleId: body.vehicleId
            }
        }
    });
    
    let calculatedPrice = pricing?.price || 0;

    if (body.tripType === 'ROUND_TRIP') {
        calculatedPrice *= 2;
    }

    if (body.selectedExtras && Array.isArray(body.selectedExtras)) {
        const extrasTotal = body.selectedExtras.reduce((sum: number, item: any) => {
            return sum + (Number(item.priceAtThatTime) * Number(item.quantity));
        }, 0);
        calculatedPrice += extrasTotal;
    }

    // YENİ: O anki güncel kurları veritabanından çek (Snapshot için)
    const adminSettings = await prisma.adminSettings.findFirst();
    const currentRateTry = adminSettings?.eurToTl ? Number(adminSettings.eurToTl) : 35.0;
    const currentRateUsd = adminSettings?.eurToUsd ? Number(adminSettings.eurToUsd) : 1.08;

    const pnrCode = "VIP" + Math.floor(1000 + Math.random() * 9000);
    const defaultBusyTo = new Date(requestedDate.getTime() + 2 * 60 * 60 * 1000);

    const newReservation = await prisma.reservation.create({
      data: {
        pnrCode,
        pickupDateTime: requestedDate,
        busyFrom: requestedDate,       
        busyTo: defaultBusyTo,         
        adultCount: Number(body.adultCount),
        childCount: Number(body.childCount),
        routeId: body.routeId,
        vehicleId: body.vehicleId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,

        tripType: body.tripType || 'ONE_WAY',
        pickupAddress: body.pickupAddress || null,
        dropoffAddress: body.dropoffAddress || null,
        
        extraNotes: body.extraNotes || null,
        customerNote: body.customerNote || null, 
        
        selectedExtras: body.selectedExtras || [], 

        totalPrice: calculatedPrice, 
        currency: 'EUR',
        
        originalPrice: body.originalPrice ? Number(body.originalPrice) : (body.totalPrice ? Number(body.totalPrice) : null),
        originalCurrency: body.originalCurrency || body.currency || null,

        // YENİ: Finansal Snapshot Kaydı
        exchangeRateTry: currentRateTry,
        exchangeRateUsd: currentRateUsd,

        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, data: newReservation }, { status: 201 });
  } catch (error) {
    console.error("Rezervasyon kayıt hatası:", error);
    return NextResponse.json({ success: false, error: 'Rezervasyon oluşturulamadı.' }, { status: 500 });
  }
}