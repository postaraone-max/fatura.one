const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        // Add any other required fields if needed, but these are minimal
      },
    });
    console.log('✅ User created successfully!');
    console.log('📌 User ID:', user.id);
    console.log('📧 Email:', user.email);
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    // If user already exists, we can fetch it
    if (error.message.includes('Unique constraint')) {
      console.log('ℹ️ User may already exist. Fetching existing user...');
      const existing = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      });
      if (existing) {
        console.log('📌 Existing user ID:', existing.id);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();