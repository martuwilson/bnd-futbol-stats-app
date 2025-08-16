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

// Test de la nueva query ME
const testMeQuery = async () => {
  console.log('🧪 TESTING ME QUERY\n');

  // Primero probamos con cada usuario
  const users = [
    { id: "cmed8mnso0000upmk1o6i0wo7", name: "Martin Williner", role: "ADMIN" },
    { id: "cmeeda0hy000eupe0j7qpqnfd", name: "Martin Manager", role: "MANAGER" },
    { id: "cmeeda0ji000fupe0nkkcghzr", name: "Martin Viewer", role: "VIEWER" }
  ];

  for (const user of users) {
    console.log(`👤 Testing ME query for ${user.name} (${user.role})`);
    
    try {
      const meQuery = `
        query GetMe($userId: String!) {
          me(userId: $userId) {
            id
            name
            email
            role
            createdAt
          }
        }
      `;

      const response = await graphqlRequest(meQuery, { userId: user.id });

      if (response.errors) {
        console.log('❌ Error:', response.errors[0].message);
      } else {
        console.log('✅ ME query successful:');
        console.log(`   - ID: ${response.data.me.id}`);
        console.log(`   - Name: ${response.data.me.name}`);
        console.log(`   - Email: ${response.data.me.email}`);
        console.log(`   - Role: ${response.data.me.role}`);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
    console.log('');
  }

  console.log('🎉 ME Query testing completed!');
  console.log('');
  console.log('📋 Next: Update frontend to use ME query');
  console.log('   - Uncomment GET_ME_QUERY imports in DashboardPage');
  console.log('   - Update query to include userId parameter');
  console.log('   - Test with all 3 user roles!');
};

testMeQuery();
