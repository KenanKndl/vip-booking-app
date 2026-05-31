import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // İşlemi garantiye almak için önce eski/yarım kalmış ayarları temizliyoruz
    await prisma.adminSettings.deleteMany();

    // Şifreyi kırılmaz formata çeviriyoruz
    const hashedPassword = await bcrypt.hash('12345678', 10);

    // Veritabanına admini yazıyoruz
    const admin = await prisma.adminSettings.create({
      data: {
        adminEmail: 'admin@matildavip.com', // Paneldeki girişine uygun hale getirdik
        hashedPassword: hashedPassword,
        whatsappNumber: '+905551234567',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: '✅ Admin başarıyla eklendi! Artık giriş yapabilirsiniz.', 
      email: admin.adminEmail 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Bir hata oluştu: ' + error.message });
  }
}