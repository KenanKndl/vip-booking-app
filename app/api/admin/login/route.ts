import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { NextResponse } from 'next/server';

// CORS başlıklarını ortak bir fonksiyon olarak tanımlıyoruz
function getCorsHeaders(origin: string | null) {
  // Geliştirme aşamasında Vite portuna, canlıda ise admin subdomainine izin verecek esnek yapı
  const allowedOrigins = ['http://localhost:5173', 'https://admin.route26.com']; 
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': currentOrigin,
    // DÜZELTME: Tarayıcıların katı kurallarına takılmamak için tüm metodlara izin veriyoruz.
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// 1. Tarayıcının güvenliği kontrol etmek için attığı ön istek (Preflight)
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

// 2. Gerçek Giriş İstek Modülü (POST)
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    const body = await request.json();
    
    // Vite (Frontend) giriş formu 'email' yerine 'username' gönderiyor olabilir.
    // İki ihtimali de yakalayarak işlemi garantiye alıyoruz.
    const { email, username, password } = body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Lütfen kullanıcı adı ve şifrenizi girin.' },
        { status: 400, headers }
      );
    }

    // Veritabanında admin kullanıcısını sorgula
    const admin = await prisma.adminSettings.findFirst({
      where: { adminEmail: loginIdentifier },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı veya şifre hatalı!' },
        { status: 401, headers }
      );
    }

    // Şifreyi güvenli şekilde kıyasla
    const isPasswordValid = await bcrypt.compare(password, admin.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı adı veya şifre hatalı!' },
        { status: 401, headers }
      );
    }

    // Token (Dijital Bilet) üretme
    const secretKey = process.env.JWT_SECRET || 'jwt_gizli_anahtar_yedek';
    const secret = new TextEncoder().encode(secretKey);
    
    const token = await new SignJWT({ adminId: admin.id, email: admin.adminEmail })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('6h')
      .sign(secret);

    // Giriş başarılı!
    return NextResponse.json(
      { 
        success: true, 
        token, 
        admin: { email: admin.adminEmail } 
      },
      { status: 200, headers }
    );

  } catch (error) {
    console.error('API Giriş Hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu tarafında bir hata oluştu.' },
      { status: 500, headers }
    );
  }
}