import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function getCorsHeaders(origin: string | null) {
  const allowedOrigins = ['http://localhost:5173', 'https://admin.matildaviptravel.com'];
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': currentOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  
  try {
    // Tüm istatistikleri tek seferde, paralel olarak veritabanından sorguluyoruz (Süper Hızlı)
    const [
      totalVehicles,
      activeVehicles,
      totalRoutes,
      allReservations,
      recentReservations
    ] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { isActive: true } }),
      prisma.route.count(),
      prisma.reservation.findMany({
        select: { status: true, totalPrice: true, currency: true }
      }),
      prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { route: true, vehicle: true }
      })
    ]);

    // Durumlara göre rezervasyon sayılarını hesapla
    const pendingCount = allReservations.filter(r => r.status === 'PENDING').length;
    const confirmedCount = allReservations.filter(r => r.status === 'CONFIRMED').length;
    const cancelledCount = allReservations.filter(r => r.status === 'CANCELLED').length;

    // Ciro Hesaplama (Sadece CONFIRMED ve COMPLETED olanları dahil ediyoruz)
    const revenueMap: { [key: string]: number } = { ' Rhine': 0, '₺': 0, '$': 0, '€': 0, '£': 0 };
    allReservations
      .filter(r => r.status === 'CONFIRMED' || r.status === 'COMPLETED')
      .forEach(r => {
        const cur = r.currency || '₺';
        revenueMap[cur] = (revenueMap[cur] || 0) + r.totalPrice;
      });

    return NextResponse.json({
      success: true,
      stats: {
        vehicles: { total: totalVehicles, active: activeVehicles },
        routes: totalRoutes,
        bookings: {
          total: allReservations.length,
          pending: pendingCount,
          confirmed: confirmedCount,
          cancelled: cancelledCount
        },
        revenue: revenueMap
      },
      recentReservations
    }, { status: 200, headers: getCorsHeaders(origin) });

  } catch (error) {
    console.error('Dashboard hatası:', error);
    return NextResponse.json({ success: false, error: 'Dashboard verileri hesaplanamadı.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}