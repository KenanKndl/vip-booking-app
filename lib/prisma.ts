import { PrismaClient } from '@prisma/client';

// Global nesneyi TypeScript'e tanıtıyoruz
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Eğer globalde bir prisma bağlantısı varsa onu kullan, yoksa yeni bir tane oluştur
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Geliştirme ortamındaysak (npm run dev), oluşturulan bu bağlantıyı globalde sakla
// Böylece hot-reload olduğunda yeni bağlantı açmak yerine hep bunu kullanır
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}