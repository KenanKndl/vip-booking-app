import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// CORS başlıkları (Vite admin panelinden gelen isteklere güvenli izin vermek için)
function getCorsHeaders(origin: string | null) {
  const allowedOrigins = ['http://localhost:5173', 'https://admin.matildaviptravel.com'];
  const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': currentOrigin,
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// 1. Tarayıcı Güvenlik Ön İsteği (Preflight)
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

// 2. Ayarları ve Güncel Kurları Getir (GET)
export async function GET(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    // Veritabanındaki ilk ayar kaydını çekiyoruz
    const settings = await prisma.adminSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Sistem ayarları bulunamadı.' },
        { status: 404, headers }
      );
    }

    // Ayarlar sayfasının beklediği şablonda verileri dönüyoruz
    return NextResponse.json(
      {
        success: true,
        data: {
          username: settings.adminEmail,
          whatsapp: settings.whatsappNumber,
          eurToTl: settings.eurToTl,
          eurToUsd: settings.eurToUsd
        }
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Ayarlar GET Hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Ayarlar yüklenirken sunucu tarafında bir hata oluştu.' },
      { status: 500, headers }
    );
  }
}

// 3. Ayarları ve Kurları Güncelle (PUT)
export async function PUT(request: Request) {
  const origin = request.headers.get('origin');
  const headers = getCorsHeaders(origin);

  try {
    const body = await request.json();
    const { username, whatsapp, eurToTl, eurToUsd, currentPassword, newPassword } = body;

    // Mevcut ayarları kontrol etmek için çekiyoruz
    const currentSettings = await prisma.adminSettings.findFirst();

    if (!currentSettings) {
      return NextResponse.json(
        { success: false, error: 'Güncellenecek ayar kaydı bulunamadı.' },
        { status: 404, headers }
      );
    }

    let updatedPasswordHash = currentSettings.hashedPassword;

    // Kullanıcı şifre değiştirmek istiyorsa validasyon adımları
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'Şifrenizi değiştirmek için mevcut şifrenizi girmelisiniz.' },
          { status: 400, headers }
        );
      }

      // Mevcut şifre veritabanındakiyle uyuşuyor mu?
      const isPasswordValid = await bcrypt.compare(currentPassword, currentSettings.hashedPassword);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, error: 'Mevcut şifreniz hatalı.' },
          { status: 401, headers }
        );
      }

      if (newPassword.length < 4) {
        return NextResponse.json(
          { success: false, error: 'Yeni şifre en az 4 karakter olmalıdır.' },
          { status: 400, headers }
        );
      }

      // Yeni şifreyi güvenli bir şekilde hash'liyoruz
      updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    // Tüm verileri (kurlar dahil) tek seferde güvenle güncelliyoruz
    const updatedSettings = await prisma.adminSettings.update({
      where: { id: currentSettings.id },
      data: {
        adminEmail: username || currentSettings.adminEmail,
        whatsappNumber: whatsapp || currentSettings.whatsappNumber,
        eurToTl: eurToTl !== undefined ? eurToTl : currentSettings.eurToTl,
        eurToUsd: eurToUsd !== undefined ? eurToUsd : currentSettings.eurToUsd,
        hashedPassword: updatedPasswordHash,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Tüm değişiklikler başarıyla kaydedildi.',
        data: {
          username: updatedSettings.adminEmail,
          whatsapp: updatedSettings.whatsappNumber,
          eurToTl: updatedSettings.eurToTl,
          eurToUsd: updatedSettings.eurToUsd
        }
      },
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Ayarlar PUT Hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Veriler kaydedilirken sunucu tarafında bir hata oluştu.' },
      { status: 500, headers }
    );
  }
}