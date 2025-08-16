const axios = require('axios');

const testLogin = async () => {
  const mutation = `
    mutation LoginUser($input: LoginInput!) {
      login(input: $input) {
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
      email: "williner.martin@gmail.com", 
      password: "Wert1234!"
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

    console.log('Login exitoso:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error en login:');
    if (error.response) {
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
};

testLogin();
