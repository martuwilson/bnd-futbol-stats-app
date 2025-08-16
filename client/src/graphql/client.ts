import { ApolloClient, InMemoryCache, createHttpLink, from, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// 🌐 HTTP Link para conectar al backend GraphQL
const httpLink = createHttpLink({
  uri: '/graphql', // Usa el proxy de Vite en desarrollo
});

// 🔐 Auth Link para JWT
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// ❌ Error Link para manejar errores
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Si el token expiró, redirigir al login
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }
});

// 🚀 Apollo Client Instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // 📊 Configuración de cache para estadísticas
          getRanking: {
            merge(_, incoming) {
              return incoming;
            },
          },
          getPlayerStatistics: {
            merge(_, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

// 📝 GraphQL Queries
const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      role
      createdAt
    }
  }
`;

// 🔧 Helper Functions
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAuthToken());
};

export const getCurrentUserId = (): string | null => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    // Decodificar JWT para obtener el user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub || null;
  } catch {
    return null;
  }
};

export const getCurrentUser = async () => {
  if (!isAuthenticated()) {
    return null;
  }

  try {
    const { data } = await apolloClient.query({
      query: GET_ME,
      fetchPolicy: 'cache-first',
    });
    return data.me;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};
