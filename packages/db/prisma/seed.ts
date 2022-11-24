import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function createTestUser() {
  return prisma.user.upsert({
    where: {
      email: 'test-user@gmail.com'
    },
    create: {
      email: 'test-user@gmail.com',
      username: 'test-user'
    },
    update: {}
  });
}

async function seed() {
  try {
    await createTestUser();
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void seed();
