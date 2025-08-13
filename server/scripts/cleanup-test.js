const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function cleanupTestUser() {
  console.log('🧹 CLEANUP: Eliminando usuario de prueba anterior');
  
  try {
    await prisma.user.deleteMany({
      where: {
        email: 'testjwt@example.com'
      }
    });
    console.log('✅ Usuario de prueba eliminado');
  } catch (error) {
    console.log('ℹ️  No hay usuario de prueba que eliminar');
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestUser();
