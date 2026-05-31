import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

function getCorsHeaders(origin: string | null) {
  const allowedOrigins = ['http://localhost:5173', 'https://admin.matildaviptravel.com'];
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': currentOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// 1. GALERİYİ GETİR (GET)
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, data: images }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Galeri çekilemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 2. YENİ FOTOĞRAF EKLE (POST)
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { url, category } = await request.json();

    if (!url || !category) {
      return NextResponse.json({ success: false, error: 'URL ve Kategori zorunludur.' }, { status: 400, headers: getCorsHeaders(origin) });
    }

    const newImage = await prisma.galleryImage.create({
      data: { url, category },
    });

    return NextResponse.json({ success: true, data: newImage }, { status: 201, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Fotoğraf yüklenemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 3. FOTOĞRAF SİL (DELETE)
export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, error: 'ID eksik.' }, { status: 400, headers: getCorsHeaders(origin) });

    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Silinemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}