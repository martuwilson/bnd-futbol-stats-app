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

// Test de queries básicas
const testBasicQueries = async () => {
  console.log('🧪 TESTING BASIC QUERIES\n');

  // 1. Test: Obtener todos los usuarios
  console.log('1️⃣ Testing: Obtener todos los usuarios');
  try {
    const usersQuery = `
      query GetAllUsers {
        users {
          id
          name
          email
          role
          createdAt
        }
      }
    `;

    const response = await graphqlRequest(usersQuery);

    if (response.errors) {
      console.log('❌ Error:', response.errors[0].message);
    } else {
      console.log('✅ Users found:', response.data.users.length);
      response.data.users.forEach(user => {
        console.log(`   - ${user.name} (${user.email}) - ${user.role} [ID: ${user.id}]`);
      });
    }
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }

  // 2. Test: Obtener todos los partidos
  console.log('2️⃣ Testing: Obtener todos los partidos');
  try {
    const matchesQuery = `
      query GetAllMatches {
        matches {
          id
          date
          team1Name
          team2Name
          team1Goals
          team2Goals
          isFinished
        }
      }
    `;

    const response = await graphqlRequest(matchesQuery);

    if (response.errors) {
      console.log('❌ Error:', response.errors[0].message);
    } else {
      console.log('✅ Matches found:', response.data.matches.length);
      response.data.matches.forEach(match => {
        console.log(`   - ${match.team1Name} vs ${match.team2Name} (${match.team1Goals}-${match.team2Goals})`);
      });
    }
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }

  // 3. Test: Obtener convocatorias activas
  console.log('3️⃣ Testing: Obtener convocatorias activas');
  try {
    const activeCallUpsQuery = `
      query GetActiveCallUps {
        activeCallUps {
          id
          title
          description
          matchDate
          location
          maxPlayers
          isOpen
          createdBy {
            name
          }
          responses {
            position
            user {
              name
            }
          }
        }
      }
    `;

    const response = await graphqlRequest(activeCallUpsQuery);

    if (response.errors) {
      console.log('❌ Error:', response.errors[0].message);
    } else {
      console.log('✅ Active call-ups found:', response.data.activeCallUps.length);
      response.data.activeCallUps.forEach(callUp => {
        console.log(`   - ${callUp.title} - ${callUp.responses.length} apuntados`);
      });
    }
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }

  // 4. Test: Top scorers básico
  console.log('4️⃣ Testing: Top scorers básico');
  try {
    const topScorersQuery = `
      query GetTopScorers {
        topScorersBasic {
          name
          goals
        }
      }
    `;

    const response = await graphqlRequest(topScorersQuery);

    if (response.errors) {
      console.log('❌ Error:', response.errors[0].message);
    } else {
      console.log('✅ Top scorers found:', response.data.topScorersBasic.length);
      response.data.topScorersBasic.forEach((scorer, index) => {
        console.log(`   ${index + 1}. ${scorer.name} - ${scorer.goals} goles`);
      });
    }
    console.log('');
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('');
  }
};

testBasicQueries();
