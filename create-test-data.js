const BASE_URL = 'http://localhost:3002/graphql';

// Helper function to make GraphQL requests
const graphqlRequest = async (query, variables = {}, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables
    })
  });
  
  return response.json();
};

// Crear datos de prueba
const createTestData = async () => {
  console.log('🧪 CREANDO DATOS DE PRUEBA\n');

  // 1. Login para obtener token
  console.log('1️⃣ Getting login token...');
  const loginMutation = `
    mutation Login($input: LoginInput!) {
      login(input: $input) {
        accessToken
        user {
          id
          name
        }
      }
    }
  `;

  const loginResponse = await graphqlRequest(loginMutation, {
    input: {
      email: "williner.martin@gmail.com",
      password: "Wert1234!"
    }
  });

  if (loginResponse.errors) {
    console.log('❌ Login failed:', loginResponse.errors[0].message);
    return;
  }

  const token = loginResponse.data.login.accessToken;
  const userId = loginResponse.data.login.user.id;
  console.log('✅ Login successful!');
  console.log('');

  // 2. Crear un partido
  console.log('2️⃣ Creating a test match...');
  const createMatchMutation = `
    mutation CreateMatch($data: CreateMatchInput!) {
      createMatch(data: $data) {
        id
        team1Name
        team2Name
        date
        notes
      }
    }
  `;

  const matchResponse = await graphqlRequest(createMatchMutation, {
    data: {
      date: "2025-08-20T19:00:00.000Z",
      team1Name: "Los Cracks",
      team2Name: "Los Champions",
      notes: "Partido amistoso de fin de semana",
      userId: userId
    }
  }, token);

  if (matchResponse.errors) {
    console.log('❌ Match creation failed:', matchResponse.errors[0].message);
  } else {
    console.log('✅ Match created:', matchResponse.data.createMatch.team1Name, 'vs', matchResponse.data.createMatch.team2Name);
  }
  console.log('');

  // 3. Crear una convocatoria
  console.log('3️⃣ Creating a test call-up...');
  const createCallUpMutation = `
    mutation CreateCallUp($data: CreateCallUpInput!) {
      createCallUp(data: $data) {
        id
        title
        matchDate
        location
        maxPlayers
      }
    }
  `;

  const callUpResponse = await graphqlRequest(createCallUpMutation, {
    data: {
      title: "Partido del Domingo",
      description: "¡Convocatoria para el partido del domingo por la tarde!",
      matchDate: "2025-08-25T16:00:00.000Z",
      location: "Cancha del Barrio",
      maxPlayers: 22,
      createdById: userId
    }
  }, token);

  if (callUpResponse.errors) {
    console.log('❌ Call-up creation failed:', callUpResponse.errors[0].message);
  } else {
    console.log('✅ Call-up created:', callUpResponse.data.createCallUp.title);
  }
  console.log('');

  // 4. Apuntarse a la convocatoria
  console.log('4️⃣ Joining the call-up...');
  const joinCallUpMutation = `
    mutation JoinCallUp($data: JoinCallUpInput!) {
      joinCallUp(data: $data) {
        id
        title
        responses {
          position
          user {
            name
          }
        }
      }
    }
  `;

  if (callUpResponse.data) {
    const joinResponse = await graphqlRequest(joinCallUpMutation, {
      data: {
        callUpId: callUpResponse.data.createCallUp.id,
        userId: userId,
        message: "¡Ahí estaré! 💪"
      }
    }, token);

    if (joinResponse.errors) {
      console.log('❌ Join call-up failed:', joinResponse.errors[0].message);
    } else {
      console.log('✅ Joined call-up! Position:', joinResponse.data.joinCallUp.responses[0].position);
    }
  }
  console.log('');

  console.log('🎉 Test data creation completed!');
  console.log('');
  console.log('📋 What you can now test:');
  console.log('   - ✅ Login system');
  console.log('   - ✅ Matches creation and listing');
  console.log('   - ✅ Call-ups creation and joining');
  console.log('   - ✅ Protected endpoints with JWT');
  console.log('   - ✅ Frontend navigation after login');
  console.log('');
  console.log('🌐 Try these in your browser:');
  console.log('   - Frontend: http://localhost:5173');
  console.log('   - GraphQL Playground: http://localhost:3002/graphql');
  console.log('');
};

createTestData();
