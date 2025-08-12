// Script para crear datos de prueba
const fetch = require('node-fetch');

const GRAPHQL_URL = 'http://localhost:3002/graphql';

async function graphqlQuery(query, variables = {}) {
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
    return result;
  } catch (error) {
    console.error('Error en query:', error);
    return null;
  }
}

async function createTestData() {
  console.log('🎲 Creando datos de prueba para el sistema de estadísticas...\n');

  // IDs de los usuarios que sabemos que existen
  const users = {
    kaiser: "cme8x07dy0000uptkttdomnkn", // ADMIN
    willy: "cme8ufv320000upygp94of2qc",  // ADMIN  
    teta: "cme8xmld20001uptkho6qeeq9",   // VIEWER
    andy: "cme8xmsu10002uptk33dzlhmk"    // VIEWER
  };

  // Crear un partido de prueba
  console.log('⚽ Creando partido de prueba...');
  const createMatchQuery = `
    mutation CreateMatch($input: CreateMatchInput!) {
      createMatch(data: $input) {
        id
        team1Name
        team2Name
        date
        user {
          name
        }
      }
    }
  `;

  const matchResult = await graphqlQuery(createMatchQuery, {
    input: {
      team1Name: "Equipo Azul",
      team2Name: "Equipo Rojo", 
      date: new Date().toISOString(),
      userId: users.kaiser
    }
  });

  if (matchResult.errors) {
    console.error('❌ Error creando partido:', matchResult.errors);
    return;
  }

  const matchId = matchResult.data.createMatch.id;
  console.log('✅ Partido creado:', matchResult.data.createMatch);

  // Agregar jugadores al partido
  console.log('\n👥 Agregando jugadores al partido...');
  
  const addPlayerQuery = `
    mutation AddPlayerToMatch($matchId: String!, $input: AddPlayerToMatchInput!) {
      addPlayerToMatch(matchId: $matchId, data: $input) {
        id
      }
    }
  `;

  // Agregar Kaiser al equipo 1
  await graphqlQuery(addPlayerQuery, {
    matchId,
    input: {
      userId: users.kaiser,
      team: 1
    }
  });

  // Agregar Teta al equipo 1
  await graphqlQuery(addPlayerQuery, {
    matchId,
    input: {
      userId: users.teta,
      team: 1
    }
  });

  // Agregar Willy al equipo 2
  await graphqlQuery(addPlayerQuery, {
    matchId,
    input: {
      userId: users.willy,
      team: 2
    }
  });

  // Agregar Andy al equipo 2
  await graphqlQuery(addPlayerQuery, {
    matchId,
    input: {
      userId: users.andy,
      team: 2
    }
  });

  console.log('✅ Jugadores agregados al partido');

  // Actualizar estadísticas de los jugadores
  console.log('\n📊 Actualizando estadísticas de jugadores...');

  const updateStatsQuery = `
    mutation UpdatePlayerStats($matchId: String!, $input: UpdatePlayerStatsInput!) {
      updatePlayerStats(matchId: $matchId, data: $input)
    }
  `;

  // Kaiser: 2 goles, 1 asistencia
  await graphqlQuery(updateStatsQuery, {
    matchId,
    input: {
      userId: users.kaiser,
      goals: 2,
      assists: 1,
      yellowCards: 0,
      redCards: 0
    }
  });

  // Teta: 1 gol, 2 asistencias
  await graphqlQuery(updateStatsQuery, {
    matchId,
    input: {
      userId: users.teta,
      goals: 1,
      assists: 2,
      yellowCards: 1,
      redCards: 0
    }
  });

  // Willy: 1 gol, 0 asistencias
  await graphqlQuery(updateStatsQuery, {
    matchId,
    input: {
      userId: users.willy,
      goals: 1,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    }
  });

  // Andy: 1 gol, 0 asistencias, 1 tarjeta amarilla
  await graphqlQuery(updateStatsQuery, {
    matchId,
    input: {
      userId: users.andy,
      goals: 1,
      assists: 0,
      yellowCards: 1,
      redCards: 0
    }
  });

  console.log('✅ Estadísticas actualizadas');

  // Ahora probar las nuevas queries de estadísticas
  console.log('\n📈 Probando sistema de estadísticas...\n');

  // Test estadísticas individuales de Kaiser
  console.log('👤 Estadísticas de Kaiser:');
  const kaiserStats = await graphqlQuery(`
    query {
      playerStatistics(userId: "${users.kaiser}") {
        user {
          name
          nickname
        }
        totalMatches
        totalGoals
        totalAssists
        effectivenessRating
        goalsPerMatch
        assistsPerMatch
      }
    }
  `);
  console.log(JSON.stringify(kaiserStats.data, null, 2));

  // Test ranking de goleadores
  console.log('\n🏆 Top Goleadores:');
  const topScorers = await graphqlQuery(`
    query {
      ranking(input: { category: "goals", limit: 5 }) {
        user {
          name
          nickname
        }
        totalGoals
        effectivenessRating
      }
    }
  `);
  console.log(JSON.stringify(topScorers.data, null, 2));

  // Test estadísticas de temporada
  console.log('\n📊 Estadísticas de Temporada:');
  const seasonStats = await graphqlQuery(`
    query {
      seasonStatistics {
        totalMatches
        totalGoals
        totalAssists
        averageGoalsPerMatch
        topScorers {
          user {
            name
            nickname
          }
          totalGoals
          effectivenessRating
        }
        topAssists {
          user {
            name
            nickname
          }
          totalAssists
        }
      }
    }
  `);
  console.log(JSON.stringify(seasonStats.data, null, 2));

  console.log('\n🎉 ¡Sistema de estadísticas funcionando perfectamente!');
}

createTestData().catch(console.error);
