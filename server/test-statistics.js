// Script de prueba para las estadísticas
const fetch = require('node-fetch');

const GRAPHQL_URL = 'http://localhost:3002/graphql';

async function testQuery(query, variables = {}) {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    console.log('✅ Query exitosa:');
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('❌ Error en query:', error);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Iniciando pruebas del sistema de estadísticas...\n');

  // Test 1: Obtener usuarios disponibles
  console.log('📋 Test 1: Consultando usuarios disponibles');
  await testQuery(`
    query {
      users {
        id
        name
        nickname
        position
        role
      }
    }
  `);

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Obtener partidos disponibles
  console.log('⚽ Test 2: Consultando partidos disponibles');
  await testQuery(`
    query {
      matches {
        id
        team1Name
        team2Name
        date
        user {
          name
        }
      }
    }
  `);

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Probar estadísticas de temporada
  console.log('📊 Test 3: Estadísticas de temporada');
  await testQuery(`
    query {
      seasonStatistics {
        totalMatches
        totalGoals
        totalAssists
        averageGoalsPerMatch
        averageAssistsPerMatch
        topScorers {
          user {
            name
            nickname
          }
          totalGoals
          effectivenessRating
        }
      }
    }
  `);
}

runTests().catch(console.error);
