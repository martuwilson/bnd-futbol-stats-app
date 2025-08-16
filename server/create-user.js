const axios = require('axios');

const createUser = async () => {
  const mutation = `
    mutation RegisterUser($input: RegisterInput!) {
      register(input: $input) {
        user {
          id
          email
          name
          role
        }
        accessToken
        refreshToken
      }
    }
  `;

  const variables = {
    input: {
      name: "Martin Williner",
      email: "williner.martin@gmail.com", 
      password: "Wert1234!",
      role: "ADMIN"
    }
  };

  try {
    const response = await axios.post('http://localhost:3002/graphql', {
      query: mutation,
      variables: variables
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Usuario creado exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error al crear usuario:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
};

createUser();
