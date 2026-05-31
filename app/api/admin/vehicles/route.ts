import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// İki proje arası (Vite -> Next.js) iletişim izni (CORS)
function getCorsHeaders(origin: string | null) {
  const allowedOrigins = ['http://localhost:5173', 'https://admin.matildaviptravel.com'];
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': currentOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// Güvenlik duvarı ön kontrolü
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// 1. ARAÇLARI LİSTELE (GET)
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { name: 'asc' }, // Alfabetik sırala
    });
    
    return NextResponse.json(
      { success: true, data: vehicles },
      { status: 200, headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error('Araçlar getirilirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Araçlar veritabanından çekilemedi.' },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

// 2. YENİ ARAÇ EKLE (POST)
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  
  try {
    const body = await request.json();
    const { name, type, pax, luggage, features, isActive, imageUrl } = body;

    if (!name || !type || !pax || !luggage) {
      return NextResponse.json(
        { success: false, error: 'Lütfen zorunlu alanları doldurun.' },
        { status: 400, headers: getCorsHeaders(origin) }
      );
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        name,
        type,
        pax: Number(pax), // GÜNCELLEME: ParseInt yerine Number ile daha güvenli tip dönüşümü
        luggage: Number(luggage),
        // GÜNCELLEME: Artık string array değil, doğrudan JSON obje dizisi olarak veritabanına işlenecek (Çoklu dil)
        features: features || [], 
        isActive: isActive !== undefined ? isActive : true,
        imageUrl: imageUrl || null, 
      },
    });

    return NextResponse.json(
      { success: true, data: newVehicle, message: 'Araç başarıyla eklendi!' },
      { status: 201, headers: getCorsHeaders(origin) }
    );
  } catch (error) {
    console.error('Araç eklenirken hata:', error);
    return NextResponse.json(
      { success: false, error: 'Araç sisteme kaydedilemedi.' },
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}

// 3. ARACI GÜNCELLE (PUT)
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  
  try {
    const body = await request.json();
    const { id, name, type, pax, luggage, features, isActive, imageUrl } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Araç ID bilgisi eksik.' }, { status: 400, headers: getCorsHeaders(origin) });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        name,
        type,
        pax: Number(pax),
        luggage: Number(luggage),
        // GÜNCELLEME: Frontend'den gelen güncel çoklu dil JSON donanım verisi
        features: features || [],
        isActive: isActive !== undefined ? isActive : true,
        ...(imageUrl && { imageUrl }), // Sadece yeni görsel geldiyse günceller, yoksa eski görsel kalır
      },
    });

    return NextResponse.json({ success: true, data: updatedVehicle, message: 'Araç güncellendi!' }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error('Araç güncellenirken hata:', error);
    return NextResponse.json({ success: false, error: 'Araç güncellenemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 4. ARACI SİL (DELETE)
export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  
  try {
    // Silinecek ID'yi URL'den alıyoruz (Örn: /api/admin/vehicles?id=123)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Silinecek aracın ID bilgisi bulunamadı.' }, { status: 400, headers: getCorsHeaders(origin) });
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Araç başarıyla silindi.' }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error('Araç silinirken hata:', error);
    return NextResponse.json({ success: false, error: 'Araç silinemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}