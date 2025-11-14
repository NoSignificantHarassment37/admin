import { PrismaClient } from '../../prisma/generated/client.js';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Shutdown limpio SI el proceso recibe señales
const shutdown = async () => {
  try {
    await prisma.$disconnect()
  } catch (_) {}
}

process.once('SIGINT', shutdown)
process.once('SIGTERM', shutdown)
