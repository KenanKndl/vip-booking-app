// app/api/client/reservations/status/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pnrCode, email } = await request.json();

    if (!pnrCode || !email) {
      return NextResponse.json(
        { success: false, error: 'PNR Kodu ve E-posta adresi gereklidir.' }, 
        { status: 400 }
      );
    }

    // Veritabanında PNR koduna göre rezervasyonu bul
    const reservation = await prisma.reservation.findUnique({
      where: { pnrCode: pnrCode.trim().toUpperCase() },
      include: {
        route: true,
        vehicle: true,
      }
    });

    // Eğer PNR yoksa veya PNR var ama E-posta eşleşmiyorsa hata dön (Güvenlik Kalkanı)
    if (!reservation || reservation.customerEmail.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Girdiğiniz bilgilere ait bir rezervasyon bulunamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.' }, 
        { status: 404 }
      );
    }

    // Eşleşme başarılı! Sadece müşterinin görmesi gereken güvenli bilgileri frontend'e yolla
    return NextResponse.json({
      success: true,
      data: {
        pnrCode: reservation.pnrCode,
        status: reservation.status,
        pickupDateTime: reservation.pickupDateTime,
        customerName: reservation.customerName,
        totalPrice: reservation.totalPrice,
        currency: reservation.currency,
        originalPrice: reservation.originalPrice,
        originalCurrency: reservation.originalCurrency,
        tripType: reservation.tripType,
        route: { pickup: reservation.route.pickup, dropoff: reservation.route.dropoff },
        vehicle: { name: reservation.vehicle.name }
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Rezervasyon sorgulama hatası:", error);
    return NextResponse.json(
      { success: false, error: 'Sistem sunucusunda bir hata oluştu.' }, 
      { status: 500 }
    );
  }
}