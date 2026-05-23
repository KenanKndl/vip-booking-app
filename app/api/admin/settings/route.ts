import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Şifreleme modülümüzü ekledik

function getCorsHeaders(origin: string | null) {
  const allowedOrigins = ['http://localhost:5173', 'https://admin.route26.com'];
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  return {
    'Access-Control-Allow-Origin': currentOrigin,
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(origin) });
}

// 1. AYARLARI GETİR
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  try {
    let settings = await prisma.adminSettings.findFirst();
    
    if (!settings) {
      // Eğer hiç ayar yoksa, 'admin' şifresini hashleyerek varsayılan oluştur
      const defaultHashedPassword = await bcrypt.hash('admin', 10);
      settings = await prisma.adminSettings.create({
        data: { adminEmail: 'admin', hashedPassword: defaultHashedPassword, whatsappNumber: '+905550000000' }
      });
    }
    
    const formattedData = {
      username: settings.adminEmail,
      whatsapp: settings.whatsappNumber,
      // Şifreyi frontend'e göndermeye gerek yok, güvenlik için boş bırakabiliriz
      password: '' 
    };

    return NextResponse.json({ success: true, data: formattedData }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ayarlar çekilemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}

// 2. AYARLARI GÜNCELLE
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  try {
    const body = await request.json();
    const { username, whatsapp, currentPassword, newPassword } = body;

    const settings = await prisma.adminSettings.findFirst();
    if (!settings) return NextResponse.json({ success: false, error: 'Ayar bulunamadı.' }, { status: 404, headers: getCorsHeaders(origin) });

    let finalPassword = settings.hashedPassword;

    // EĞER KULLANICI ŞİFREYİ DEĞİŞTİRMEK İSTİYORSA
    if (newPassword) {
      // 1. Girdiği 'Mevcut Şifre' ile veritabanındaki Hash'li şifreyi kıyasla
      const isMatch = await bcrypt.compare(currentPassword, settings.hashedPassword).catch(() => false);
      
      // Eğer ne düz metin ne de hash olarak eşleşmiyorsa hata fırlat
      if (currentPassword !== settings.hashedPassword && !isMatch) {
        return NextResponse.json({ success: false, error: 'Mevcut şifreniz hatalı!' }, { status: 400, headers: getCorsHeaders(origin) });
      }

      // 2. Eşleştiyse, yeni şifreyi güvenli bir şekilde Hash'le
      finalPassword = await bcrypt.hash(newPassword, 10);
    }

    const updatedSettings = await prisma.adminSettings.update({
      where: { id: settings.id },
      data: { 
        adminEmail: username, 
        whatsappNumber: whatsapp, 
        hashedPassword: finalPassword 
      }
    });

    return NextResponse.json({ success: true }, { status: 200, headers: getCorsHeaders(origin) });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Ayarlar güncellenemedi.' }, { status: 500, headers: getCorsHeaders(origin) });
  }
}