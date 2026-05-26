import { prisma } from '@/lib/prisma'; // Singleton bağlantımız sayesinde fişek gibi çalışacak
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

// 1. REZERVASYONLARI GETİR (GET)
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        route: true,    // Hangi rotadan gidilecek (pickup, dropoff)
        vehicle: true,  // Hangi araçla gidilecek
      },
      orderBy: { createdAt: 'desc' }, // En yeni rezervasyon en üstte
    });
    return NextResponse.json({ success: true, data: reservations }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Rezervasyonlar çekilemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 2. REZERVASYONU GÜNCELLE (PUT) - Hem hızlı durum güncellemesi hem de tam düzenleme için
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();
    
    // EKSİK OLAN KISIM EKLENDİ: busyFrom ve busyTo alanlarını da body'den alıyoruz
    const { 
      id, status, customerName, customerPhone, pickupDateTime, 
      totalPrice, currency, routeId, busyFrom, busyTo 
    } = body;

    if (!id) return NextResponse.json({ success: false, error: 'ID eksik.' }, { status: 400, headers: getCorsHeaders(origin) });

    // Sadece gelen (değişen) verileri güncelleyen dinamik yapı
    const updateData: any = {};
    if (status) updateData.status = status;
    if (customerName) updateData.customerName = customerName;
    if (customerPhone) updateData.customerPhone = customerPhone;
    if (pickupDateTime) updateData.pickupDateTime = new Date(pickupDateTime);
    if (totalPrice !== undefined) updateData.totalPrice = Number(totalPrice);
    if (currency) updateData.currency = currency;
    if (routeId) updateData.routeId = routeId;

    // ==========================================
    // 🛡️ DİNAMİK ARAÇ BLOKAJI GÜNCELLEMESİ 
    // ==========================================
    if (status === 'CANCELLED') {
      // Eğer rezervasyon iptal edildiyse, aracın üzerindeki kilidi tamamen kaldır (null yap)
      updateData.busyFrom = null;
      updateData.busyTo = null;
    } else {
      // İptal edilmediyse ve admin özel bir saat gönderdiyse o saatleri kaydet
      if (busyFrom) updateData.busyFrom = new Date(busyFrom);
      if (busyTo) updateData.busyTo = new Date(busyTo);
    }
    // ==========================================

    const updatedRes = await prisma.reservation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedRes }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error("Admin Rezervasyon Güncelleme Hatası:", error);
    return NextResponse.json({ success: false, error: 'Güncellenemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}