import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function getCorsHeaders(origin: string | null) {
  const allowedOrigins = ['http://localhost:5173', 'https://admin.route26.com'];
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': currentOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// 1. ROTALARI VE İÇİNDEKİ FİYATLARI GETİR (GET)
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const routes = await prisma.route.findMany({
      include: {
        prices: true, // Rotaya bağlı fiyatları (VehiclePrice) da getir
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: routes }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Rotalar çekilemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 2. YENİ ROTA VE FİYATLARINI EKLE (POST)
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { pickup, dropoff, prices } = await request.json();

    if (!pickup || !dropoff || !prices || prices.length === 0) {
      return NextResponse.json({ success: false, error: 'Kalkış, Varış ve en az bir araç fiyatı zorunludur.' }, { status: 400, headers: getCorsHeaders(origin) });
    }

    // Prisma Transaction ile Rota ve Fiyatları aynı anda oluşturuyoruz
    const newRoute = await prisma.route.create({
      data: {
        pickup,
        dropoff,
        prices: {
          create: prices.map((p: any) => ({
            vehicleId: p.vehicleId,
            price: Number(p.price),
            currency: p.currency,
          })),
        },
      },
      include: { prices: true }, // Eklenen veriyi geri döndür
    });

    return NextResponse.json({ success: true, data: newRoute }, { status: 201, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Rota eklenirken bir hata oluştu.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 3. ROTAYI VE İÇİNDEKİ FİYATLARI SİL (DELETE)
export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID eksik.' }, { status: 400, headers: getCorsHeaders(origin) });

    await prisma.route.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Silinemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 4. ROTAYI VE FİYATLARI GÜNCELLE (PUT)
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { id, pickup, dropoff, prices } = await request.json();

    if (!id || !pickup || !dropoff || !prices) {
      return NextResponse.json({ success: false, error: 'Eksik veri.' }, { status: 400, headers: getCorsHeaders(origin) });
    }

    // 1. Önce eski fiyatları temizle, 2. Rotayı güncelle ve yeni fiyatları ekle (Transaction)
    const updatedRoute = await prisma.$transaction([
      prisma.routePricing.deleteMany({ where: { routeId: id } }),
      prisma.route.update({
        where: { id },
        data: {
          pickup,
          dropoff,
          prices: {
            create: prices.map((p: any) => ({
              vehicleId: p.vehicleId,
              price: Number(p.price),
              currency: p.currency,
            })),
          },
        },
        include: { prices: true },
      }),
    ]);

    return NextResponse.json({ success: true, data: updatedRoute[1] }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Güncellenemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}