import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Müşterinin gönderdiği formu Prisma ContactMessage tablosuna kaydet
    const newMessage = await prisma.contactMessage.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        message: body.message,
      }
    });

    return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
  } catch (error) {
    console.error("Mesaj kayıt hatası:", error);
    return NextResponse.json({ success: false, error: 'Mesaj gönderilirken bir hata oluştu.' }, { status: 500 });
  }
}