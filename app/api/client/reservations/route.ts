// app/api/client/reservations/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Müşterinin seçtiği tarihi Date objesine çeviriyoruz
    const requestedDate = new Date(body.pickupDateTime);

    // ==========================================
    // 🛡️ DİNAMİK ÇİFTE REZERVASYON (DOUBLE-BOOKING) KALKANI
    // ==========================================
    // Müşterinin istediği saat, bu araç için admin tarafından 
    // belirlenmiş (veya geçici atanan) bloke saatleri arasına denk geliyor mu?
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        vehicleId: body.vehicleId,
        status: { in: ['PENDING', 'CONFIRMED'] }, // Sadece Bekleyen veya Onaylanmış işleri çakışma say
        busyFrom: { lte: requestedDate }, // bloke başlangıcı, istenen saatten önce veya eşitse
        busyTo: { gte: requestedDate }    // bloke bitişi, istenen saatten sonra veya eşitse
      }
    });

    // Eğer çakışan bir kayıt bulunduysa, işlemi durdur ve Frontend'e hata fırlat
    if (conflictingReservation) {
      return NextResponse.json({
        success: false,
        error: 'Seçtiğiniz araç bu saat aralığında başka bir transfer için doludur. Lütfen farklı bir saat veya araç seçiniz.'
      }, { status: 400 });
    }
    // ==========================================

    // Benzersiz bir PNR kodu üret (Örn: VIP4892)
    const pnrCode = "VIP" + Math.floor(1000 + Math.random() * 9000);

    // Yönetici henüz onaylamadığı için, sistem aracı geçici olarak korumaya alır.
    // Varsayılan olarak transfer saatinden itibaren 2 saat boyunca bu aracı başkasına kapattık.
    const defaultBusyTo = new Date(requestedDate.getTime() + 2 * 60 * 60 * 1000);

    const newReservation = await prisma.reservation.create({
      data: {
        pnrCode,
        pickupDateTime: requestedDate,
        busyFrom: requestedDate,       // Geçici blok başlangıcı
        busyTo: defaultBusyTo,         // Geçici blok bitişi
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