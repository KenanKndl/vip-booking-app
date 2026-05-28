import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

// İki proje arası (Vite -> Next.js) iletişim izni (CORS)
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

// Güvenlik duvarı ön kontrolü (CORS Pre-flight)
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  
  try {
    const { email, recoveryKey, newPassword } = await request.json();

    // 1. MASTER KEY Kontrolü
    const masterKey = process.env.MASTER_RECOVERY_KEY;
    if (!recoveryKey || recoveryKey !== masterKey) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz kurtarma anahtarı!' }, 
        { status: 403, headers: getCorsHeaders(origin) }
      );
    }

    // 2. Admin'i veritabanında bul
    const admin = await prisma.adminSettings.findUnique({
      where: { adminEmail: email }
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Admin hesabı bulunamadı.' }, 
        { status: 404, headers: getCorsHeaders(origin) }
      );
    }

    // 3. Yeni şifreyi Hash'le ve Güncelle
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.adminSettings.update({
      where: { adminEmail: email },
      data: { hashedPassword: hashedPassword }
    });

    return NextResponse.json(
      { success: true, message: 'Şifre başarıyla güncellendi.' }, 
      { status: 200, headers: getCorsHeaders(origin) }
    );

  } catch (error) {
    console.error("Şifre sıfırlama hatası:", error);
    return NextResponse.json(
      { success: false, error: 'Sistem hatası.' }, 
      { status: 500, headers: getCorsHeaders(origin) }
    );
  }
}