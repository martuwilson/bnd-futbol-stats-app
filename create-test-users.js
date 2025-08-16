const BASE_URL = 'http://localhost:3002/graphql';

// Helper function to make GraphQL requests
const graphqlRequest = async (query, variables = {}) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  });
  
  return response.json();
};

// Crear usuarios con diferentes roles
const createTestUsers = async () => {
  console.log('👥 CREANDO USUARIOS DE PRUEBA CON DIFERENTES ROLES\n');

  const users = [
    {
      name: "Martin Manager",
      email: "williner@manager.com",
      password: "Manager123!",
      role: "MANAGER"
    },
    {
      name: "Martin Viewer", 
      email: "williner@viewer.com",
      password: "Viewer123!",
      role: "VIEWER"
    }
  ];

  const registerMutation = `
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        user {
          id
          name
          email
          role
        }
        accessToken
      }
    }
  `;

  for (const userData of users) {
    console.log(`🔧 Creando usuario: ${userData.name} (${userData.role})`);
    
    try {
      const response = await graphqlRequest(registerMutation, {
        input: userData
      });

      if (response.errors) {
        console.log(`❌ Error creando ${userData.email}:`, response.errors[0].message);
      } else {
        console.log(`✅ Usuario creado exitosamente:`);
        console.log(`   - Nombre: ${response.data.register.user.name}`);
        console.log(`   - Email: ${response.data.register.user.email}`);
        console.log(`   - Rol: ${response.data.register.user.role}`);
        console.log(`   - ID: ${response.data.register.user.id}`);
      }
    } catch (error) {
      console.log(`❌ Error de red creando ${userData.email}:`, error.message);
    }
    console.log('');
  }

  console.log('🎉 USUARIOS CREADOS - AHORA TENEMOS:');
  console.log('   🔑 ADMIN: williner.martin@gmail.com / Wert1234!');
  console.log('   🛡️  MANAGER: williner@manager.com / Manager123!');
  console.log('   👀 VIEWER: williner@viewer.com / Viewer123!');
  console.log('');
  console.log('📋 PERMISOS POR ROL:');
  console.log('   🔑 ADMIN: Todo (crear/editar/eliminar partidos, usuarios, etc.)');
  console.log('   🛡️  MANAGER: Crear/editar partidos, gestionar convocatorias');
  console.log('   👀 VIEWER: Solo ver partidos y estadísticas, apuntarse a convocatorias');
  console.log('');
  console.log('🧪 LISTO PARA TESTING END-TO-END DESDE EL FRONTEND!');
};

createTestUsers();
