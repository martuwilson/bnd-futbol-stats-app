const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function createManagerUser() {
  console.log('🎯 CREATING MANAGER USER FOR TESTING');
  console.log('====================================\n');

  try {
    // Crear un usuario con rol MANAGER
    const managerUser = await prisma.user.create({
      data: {
        name: 'Carlos Rodriguez',
        email: 'carlos@futbol.manager',
        password: 'manager123',
        role: 'MANAGER'
      }
    });

    console.log('✅ Usuario MANAGER creado exitosamente:');
    console.log(`   ID: ${managerUser.id}`);
    console.log(`   Nombre: ${managerUser.name}`);
    console.log(`   Email: ${managerUser.email}`);
    console.log(`   Rol: ${managerUser.role}`);

    console.log('\n🧪 TESTING COMPLETE PERMISSION SYSTEM WITH MANAGER');
    
    // Obtener todos los usuarios por roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: {
        role: 'desc' // VIEWER, MANAGER, ADMIN
      }
    });

    console.log('\n👥 USUARIOS COMPLETOS POR ROL:');
    users.forEach(user => {
      const roleIcon = user.role === 'ADMIN' ? '👑' : 
                       user.role === 'MANAGER' ? '🎯' : '👀';
      console.log(`${roleIcon} ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\n🛡️ SISTEMA DE ROLES COMPLETO IMPLEMENTADO');

  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️  Usuario MANAGER ya existe en el sistema');
    } else {
      console.error('❌ Error creating manager user:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createManagerUser();
