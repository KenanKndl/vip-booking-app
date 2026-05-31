import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Vite ile Next.js arası iletişim (CORS) İzni
function getCorsHeaders(origin: string | null) {
  const allowedOrigins = ['http://localhost:5173', 'https://admin.matildaviptravel.com'];
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': currentOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// 1. MESAJLARI GETİR
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' } // En yeni mesaj en üstte
    });
    return NextResponse.json({ success: true, data: messages }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mesajlar getirilemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 2. MESAJI OKUNDU İŞARETLE
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { id, isRead } = await request.json();
    
    if (!id) return NextResponse.json({ success: false, error: 'ID eksik' }, { status: 400, headers: getCorsHeaders(origin) });

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { isRead }
    });
    return NextResponse.json({ success: true, data: updatedMessage }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mesaj güncellenemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 3. MESAJI SİL
export async function DELETE(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ success: false, error: 'ID eksik' }, { status: 400, headers: getCorsHeaders(origin) });

    await prisma.contactMessage.delete({
      where: { id }
    });
    return NextResponse.json({ success: true, message: 'Mesaj silindi.' }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mesaj silinemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}