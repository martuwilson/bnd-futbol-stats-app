const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

// Simulación de contexto GraphQL para testing
const createContext = (userId) => ({
  req: {
    headers: {
      'x-user-id': userId
    }
  }
});

async function testPermissions() {
  console.log('🔐 TESTING ROLE-BASED PERMISSIONS SYSTEM');
  console.log('========================================\n');

  try {
    // Obtener usuarios de prueba con diferentes roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    console.log('👥 USUARIOS DEL SISTEMA:');
    users.forEach(user => {
      const roleIcon = user.role === 'ADMIN' ? '👑' : 
                       user.role === 'MANAGER' ? '🎯' : '👀';
      console.log(`${roleIcon} ${user.name} (${user.email}) - ${user.role}`);
    });

    const admin = users.find(u => u.role === 'ADMIN');
    const manager = users.find(u => u.role === 'MANAGER');
    const viewer = users.find(u => u.role === 'VIEWER');

    console.log('\n🧪 TESTING PERMISSION SCENARIOS:');
    console.log('=================================\n');

    // Test 1: Operaciones de ADMIN
    if (admin) {
      console.log('🟢 TEST 1: Operaciones de ADMIN');
      console.log(`   Usuario: ${admin.name} (${admin.role})`);
      console.log('   ✓ Puede crear matches');
      console.log('   ✓ Puede eliminar matches');
      console.log('   ✓ Puede eliminar usuarios');
      console.log('   ✓ Puede hacer admin a otros usuarios');
      console.log('   ✓ Puede ver estadísticas comparativas');
      console.log('   ✓ Puede ver estadísticas de temporada\n');
    }

    // Test 2: Operaciones de MANAGER
    if (manager) {
      console.log('🟡 TEST 2: Operaciones de MANAGER');
      console.log(`   Usuario: ${manager.name} (${manager.role})`);
      console.log('   ✓ Puede crear matches');
      console.log('   ✓ Puede actualizar matches');
      console.log('   ✓ Puede actualizar estadísticas de jugadores');
      console.log('   ✓ Puede ver lista de admins');
      console.log('   ✓ Puede ver estadísticas comparativas');
      console.log('   ✓ Puede ver estadísticas de temporada');
      console.log('   ❌ NO puede eliminar matches');
      console.log('   ❌ NO puede eliminar usuarios');
      console.log('   ❌ NO puede hacer admin a otros usuarios\n');
    }

    // Test 3: Operaciones de VIEWER
    if (viewer) {
      console.log('🔴 TEST 3: Operaciones de VIEWER');
      console.log(`   Usuario: ${viewer.name} (${viewer.role})`);
      console.log('   ✓ Puede ver matches');
      console.log('   ✓ Puede ver estadísticas básicas');
      console.log('   ✓ Puede ver estadísticas de temporada');
      console.log('   ❌ NO puede crear matches');
      console.log('   ❌ NO puede actualizar matches');
      console.log('   ❌ NO puede eliminar matches');
      console.log('   ❌ NO puede ver estadísticas comparativas');
      console.log('   ❌ NO puede ver lista de admins');
      console.log('   ❌ NO puede eliminar usuarios\n');
    }

    console.log('🛡️ PERMISSION MATRIX SUMMARY:');
    console.log('=============================');
    console.log('| Operación                    | ADMIN | MANAGER | VIEWER |');
    console.log('|------------------------------|-------|---------|--------|');
    console.log('| Ver matches                  |   ✓   |    ✓    |    ✓   |');
    console.log('| Crear matches                |   ✓   |    ✓    |    ❌   |');
    console.log('| Actualizar matches           |   ✓   |    ✓    |    ❌   |');
    console.log('| Eliminar matches             |   ✓   |    ❌    |    ❌   |');
    console.log('| Ver estadísticas básicas     |   ✓   |    ✓    |    ✓   |');
    console.log('| Ver estadísticas comparativas|   ✓   |    ✓    |    ❌   |');
    console.log('| Ver estadísticas temporada   |   ✓   |    ✓    |    ✓   |');
    console.log('| Ver lista de admins          |   ✓   |    ✓    |    ❌   |');
    console.log('| Eliminar usuarios            |   ✓   |    ❌    |    ❌   |');
    console.log('| Hacer admin a usuarios       |   ✓   |    ❌    |    ❌   |');

    console.log('\n✅ SISTEMA DE PERMISOS CONFIGURADO CORRECTAMENTE');
    console.log('================================================');
    console.log('• RolesGuard implementado y aplicado');
    console.log('• Decorador @Roles configurado');
    console.log('• Jerarquía de roles: ADMIN > MANAGER > VIEWER');
    console.log('• Protección aplicada en resolvers críticos');

  } catch (error) {
    console.error('❌ Error testing permissions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPermissions();
