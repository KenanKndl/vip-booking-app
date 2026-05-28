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

    // ==========================================
    // 💰 GÜVENLİ FİYAT HESAPLAMASI (BACKEND)
    // ==========================================
    // 1. Temel rota ve araç fiyatını bul
    const pricing = await prisma.routePricing.findUnique({
        where: {
            routeId_vehicleId: {
                routeId: body.routeId,
                vehicleId: body.vehicleId
            }
        }
    });
    
    let calculatedPrice = pricing?.price || 0;

    // 2. Gidiş-Dönüş ise fiyatı ikiye katla
    if (body.tripType === 'ROUND_TRIP') {
        calculatedPrice *= 2;
    }

    // 3. Ekstraları topla (Ekstra Fiyatı * Adet)
    if (body.selectedExtras && Array.isArray(body.selectedExtras)) {
        const extrasTotal = body.selectedExtras.reduce((sum: number, item: any) => {
            return sum + (Number(item.priceAtThatTime) * Number(item.quantity));
        }, 0);
        calculatedPrice += extrasTotal;
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

        // YENİ: Arayüzden gelen adres ve detaylar
        tripType: body.tripType || 'ONE_WAY',
        pickupAddress: body.pickupAddress || null,
        dropoffAddress: body.dropoffAddress || null,
        extraNotes: body.extraNotes || null,
        
        // YENİ: Seçilen ekstraların JSON olarak kaydedilmesi
        selectedExtras: body.selectedExtras || [], 

        // GÜNCELLEME: Frontend'den gelen fiyat yerine backend'in güvenli hesapladığı fiyat
        totalPrice: calculatedPrice, 
        currency: body.currency || 'EUR',
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, data: newReservation }, { status: 201 });
  } catch (error) {
    console.error("Rezervasyon kayıt hatası:", error);
    return NextResponse.json({ success: false, error: 'Rezervasyon oluşturulamadı.' }, { status: 500 });
  }
}