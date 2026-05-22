// app/api/client/reservations/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Benzersiz bir PNR kodu üret (Örn: VIP4892)
    const pnrCode = "VIP" + Math.floor(1000 + Math.random() * 9000);

    const newReservation = await prisma.reservation.create({
      data: {
        pnrCode,
        pickupDateTime: new Date(body.pickupDateTime),
        adultCount: Number(body.adultCount),
        childCount: Number(body.childCount),
        routeId: body.routeId,
        vehicleId: body.vehicleId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        customerEmail: body.customerEmail,
        totalPrice: Number(body.totalPrice),
        currency: body.currency,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, data: newReservation }, { status: 201 });
  } catch (error) {
    console.error("Rezervasyon kayıt hatası:", error);
    return NextResponse.json({ success: false, error: 'Rezervasyon oluşturulamadı.' }, { status: 500 });
  }
}