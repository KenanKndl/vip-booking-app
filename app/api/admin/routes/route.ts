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

// 1. Sadece AKTİF Rotaları Listele (GET)
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  try {
    const routes = await prisma.route.findMany({
      where: { isActive: true }, // Silinmiş gibi davranan pasif rotaları listeye dahil etmiyoruz
      include: { prices: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: routes }, { status: 200, headers });
  } catch (error) {
    console.error('Rotalar GET Hatası:', error);
    return NextResponse.json({ success: false, error: 'Rotalar yüklenirken hata oluştu.' }, { status: 500, headers });
  }
}

// 2. Yeni Rota Ekle (POST)
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  try {
    const body = await request.json();
    const { pickup, dropoff, prices } = body;

    if (!pickup || !dropoff) {
      return NextResponse.json({ success: false, error: 'Kalkış ve Varış noktaları zorunludur.' }, { status: 400, headers });
    }

    // Eğer daha önce pasife alınmış (isActive: false) bir rota tekrar eklenmek istenirse sıfırdan yaratmak yerine aktife çekiyoruz
    const existingRoute = await prisma.route.findFirst({ where: { pickup, dropoff } });
    if (existingRoute) {
      if (!existingRoute.isActive) {
        const reactivatedRoute = await prisma.route.update({
          where: { id: existingRoute.id },
          data: { 
            isActive: true,
            prices: {
              deleteMany: {},
              create: prices.map((p: any) => ({
                vehicleId: p.vehicleId,
                price: Number(p.price),
                currency: p.currency || 'EUR'
              }))
            }
          },
          include: { prices: true }
        });
        return NextResponse.json({ success: true, data: reactivatedRoute }, { status: 200, headers });
      }
      return NextResponse.json({ success: false, error: 'Bu güzergah zaten ekli.' }, { status: 400, headers });
    }

    const newRoute = await prisma.route.create({
      data: {
        pickup, dropoff,
        prices: {
          create: prices.map((p: any) => ({
            vehicleId: p.vehicleId,
            price: Number(p.price),
            currency: p.currency || 'EUR'
          }))
        }
      },
      include: { prices: true }
    });
    return NextResponse.json({ success: true, data: newRoute }, { status: 201, headers });
  } catch (error) {
    console.error('Rota POST Hatası:', error);
    return NextResponse.json({ success: false, error: 'Rota eklenirken hata oluştu.' }, { status: 500, headers });
  }
}

// 3. Rota Güncelle (PUT)
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  try {
    const body = await request.json();
    const { id, pickup, dropoff, prices } = body;
    if (!id) return NextResponse.json({ success: false, error: 'Rota ID eksik.' }, { status: 400, headers });

    const updatedRoute = await prisma.route.update({
      where: { id },
      data: {
        pickup, dropoff,
        prices: {
          deleteMany: {},
          create: prices.map((p: any) => ({
            vehicleId: p.vehicleId,
            price: Number(p.price),
            currency: p.currency || 'EUR'
          }))
        }
      },
      include: { prices: true }
    });
    return NextResponse.json({ success: true, data: updatedRoute }, { status: 200, headers });
  } catch (error) {
    console.error('Rota PUT Hatası:', error);
    return NextResponse.json({ success: false, error: 'Rota güncellenirken hata oluştu.' }, { status: 500, headers });
  }
}

// 4. Akıllı Rota Silme / Pasife Alma (DELETE)
export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID eksik.' }, { status: 400, headers });

    // Rota üzerinde AKTİF/BEKLEYEN rezervasyon var mı kontrol ediyoruz
    const activeReservations = await prisma.reservation.findFirst({
      where: {
        routeId: id,
        status: { in: ['PENDING', 'CONFIRMED'] } // Sadece bu durumlar silmeye engel teşkil eder
      }
    });

    // Eğer yolcusu kesinleşmiş veya bekleyen transfer varsa silmeyi engelle
    if (activeReservations) {
      return NextResponse.json({ 
        success: false, 
        error: 'Bu rotaya ait bekleyen veya onaylanmış aktif bir rezervasyon bulunmaktadır. Bu sebeple rotayı silemezsiniz.' 
      }, { status: 400, headers });
    }

    // Aktif rezervasyon yoksa (Sadece İptal/Tamamlanan varsa veya hiç yoksa) Pasife Çek (Soft Delete)
    await prisma.route.update({
      where: { id },
      data: { isActive: false }
    });

    return NextResponse.json({ success: true, message: 'Rota başarıyla kaldırıldı.' }, { status: 200, headers });
  } catch (error) {
    console.error('Rota DELETE Hatası:', error);
    return NextResponse.json({ success: false, error: 'Silme işlemi sırasında sunucuda bir hata oluştu.' }, { status: 500, headers });
  }
}