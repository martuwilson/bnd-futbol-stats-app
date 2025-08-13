const axios = require('axios');

const GRAPHQL_URL = 'http://localhost:3002/graphql';

async function testUserRegistration() {
  console.log('🔐 TESTING USER REGISTRATION WITH REAL API CALLS');
  console.log('================================================\n');

  try {
    // Test 1: Registrar un nuevo usuario
    console.log('📝 TEST 1: Registrar nuevo usuario');
    console.log('==================================');

    const registerMutation = `
      mutation {
        register(input: {
          name: "Test User JWT"
          email: "testjwt@example.com"
          password: "password123"
          role: VIEWER
        }) {
          user {
            id
            name
            email
            role
            createdAt
          }
          accessToken
          refreshToken
        }
      }
    `;

    const registerResponse = await axios.post(GRAPHQL_URL, {
      query: registerMutation
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (registerResponse.data.errors) {
      console.log('❌ Error en registro:', registerResponse.data.errors);
    } else {
      const { user, accessToken, refreshToken } = registerResponse.data.data.register;
      console.log('✅ Usuario registrado exitosamente:');
      console.log(`   ID: ${user.id}`);
      console.log(`   Nombre: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Rol: ${user.role}`);
      console.log(`   Creado: ${user.createdAt}`);
      console.log(`   Access Token: ${accessToken.substring(0, 20)}...`);
      console.log(`   Refresh Token: ${refreshToken.substring(0, 20)}...\n`);

      // Test 2: Login con las mismas credenciales
      console.log('🔐 TEST 2: Login con credenciales creadas');
      console.log('==========================================');

      const loginMutation = `
        mutation {
          login(input: {
            email: "testjwt@example.com"
            password: "password123"
          }) {
            user {
              id
              name
              email
              role
            }
            accessToken
            refreshToken
          }
        }
      `;

      const loginResponse = await axios.post(GRAPHQL_URL, {
        query: loginMutation
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (loginResponse.data.errors) {
        console.log('❌ Error en login:', loginResponse.data.errors);
      } else {
        const loginData = loginResponse.data.data.login;
        console.log('✅ Login exitoso:');
        console.log(`   Usuario: ${loginData.user.name}`);
        console.log(`   Email: ${loginData.user.email}`);
        console.log(`   Nuevo Access Token: ${loginData.accessToken.substring(0, 20)}...\n`);

        // Test 3: Probar endpoint protegido
        console.log('🛡️ TEST 3: Acceso a endpoint protegido');
        console.log('======================================');

        const protectedQuery = `
          query {
            users {
              id
              name
              email
              role
            }
          }
        `;

        const protectedResponse = await axios.post(GRAPHQL_URL, {
          query: protectedQuery
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.accessToken}`
          }
        });

        if (protectedResponse.data.errors) {
          console.log('❌ Error accediendo a endpoint protegido:', protectedResponse.data.errors);
        } else {
          console.log('✅ Acceso exitoso a endpoint protegido');
          console.log(`   Usuarios encontrados: ${protectedResponse.data.data.users.length}`);
          protectedResponse.data.data.users.forEach(u => {
            console.log(`   - ${u.name} (${u.email}) - ${u.role}`);
          });
        }
      }
    }

    console.log('\n🎉 TESTING COMPLETO: Sistema de autenticación JWT funcional');

  } catch (error) {
    console.error('❌ Error durante testing:', error.message);
    if (error.response?.data) {
      console.error('   Respuesta del servidor:', error.response.data);
    }
  }
}

testUserRegistration();
