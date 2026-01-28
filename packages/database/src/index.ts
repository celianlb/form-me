// Re-export the Prisma client singleton
export { prisma } from './client'

// Re-export all Prisma types and enums
export * from '../generated/prisma'

// Re-export the PrismaClient class for type usage
export { PrismaClient } from '../generated/prisma'
