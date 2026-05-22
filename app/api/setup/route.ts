import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Şifreyi kırılmaz formata çeviriyoruz
    const hashedPassword = await bcrypt.hash('admin', 10);

    // Veritabanına admini yazıyoruz
    const admin = await prisma.adminSettings.create({
      data: {
        adminEmail: 'admin',
        hashedPassword: hashedPassword,
        whatsappNumber: '+905551234567',
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: '✅ Admin başarıyla eklendi!', 
      email: admin.adminEmail 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Kayıt zaten var veya bir hata oluştu.' });
  }
}