import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// CORS Headers
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

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// GET: Tüm ekstraları getir (Admin için isActive true/false fark etmeksizin hepsi gelir)
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const extras = await prisma.extra.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: extras }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error("Fetch Extras Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch extras' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// POST: Yeni ekstra ekle
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();
    const { name, price, imageUrl, isActive, category } = body;

    const newExtra = await prisma.extra.create({
      data: {
        name, // Multi-language JSON payload
        price: Number(price),
        imageUrl: imageUrl || null,
        isActive: isActive ?? true,
        category, // 'GENERAL' veya 'BABY_SEAT'
      },
    });

    return NextResponse.json({ success: true, data: newExtra }, { status: 201, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error("Create Extra Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to create extra' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// PUT: Ekstrayı güncelle
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();
    const { id, name, price, imageUrl, isActive, category } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: getCorsHeaders(origin) });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (category) updateData.category = category;

    const updatedExtra = await prisma.extra.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedExtra }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error("Update Extra Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to update extra' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// DELETE: Ekstrayı sil
export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400, headers: getCorsHeaders(origin) });
    }

    await prisma.extra.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Extra deleted successfully' }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    console.error("Delete Extra Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to delete extra' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}