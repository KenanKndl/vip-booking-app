import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const activeExtras = await prisma.extra.findMany({
      where: { 
        isActive: true 
      },
      orderBy: { 
        createdAt: 'asc' // Front-end tasarımındaki sırayı korumak için 
      }
    });

    return NextResponse.json({ success: true, data: activeExtras }, { status: 200 });
  } catch (error) {
    console.error("Client Fetch Extras Error:", error);
    return NextResponse.json({ success: false, error: 'Failed to fetch active extras' }, { status: 500 });
  }
}