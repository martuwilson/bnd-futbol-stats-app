import { gql } from '@apollo/client';

// 🔐 Authentication Mutations
export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      access_token
      refresh_token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($data: CreateUserInput!) {
    register(data: $data) {
      access_token
      refresh_token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      access_token
      refresh_token
    }
  }
`;

// 👤 User Queries
export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      name
      email
      role
      createdAt
    }
  }
`;

// 📊 Statistics Queries
export const GET_RANKING_QUERY = gql`
  query GetRanking($input: RankingInput!) {
    getRanking(input: $input) {
      user {
        id
        name
      }
      totalGoals
      totalAssists
      totalMatches
      goalsPerMatch
      assistsPerMatch
      effectivenessRating
    }
  }
`;

export const GET_PLAYER_STATISTICS_QUERY = gql`
  query GetPlayerStatistics($userId: String!) {
    getPlayerStatistics(userId: $userId) {
      user {
        id
        name
      }
      totalGoals
      totalAssists
      totalMatches
      goalsPerMatch
      assistsPerMatch
      effectivenessRating
    }
  }
`;

// 🏟️ Matches Queries
export const GET_MATCHES_QUERY = gql`
  query GetMatches {
    findAllMatches {
      id
      date
      team1Name
      team2Name
      team1Goals
      team2Goals
      location
      result
      createdAt
    }
  }
`;

export const GET_MATCH_QUERY = gql`
  query GetMatch($id: String!) {
    findOneMatch(id: $id) {
      id
      date
      team1Name
      team2Name
      team1Goals
      team2Goals
      location
      result
      matchPlayers {
        id
        team
        goals
        assists
        player {
          id
          name
        }
      }
      createdAt
    }
  }
`;

// 🏟️ Matches Mutations
export const CREATE_MATCH_MUTATION = gql`
  mutation CreateMatch($data: CreateMatchInput!) {
    createMatch(data: $data) {
      id
      date
      team1Name
      team2Name
      team1Goals
      team2Goals
      location
      result
    }
  }
`;

export const UPDATE_MATCH_MUTATION = gql`
  mutation UpdateMatch($id: String!, $data: UpdateMatchInput!) {
    updateMatch(id: $id, data: $data) {
      id
      date
      team1Name
      team2Name
      team1Goals
      team2Goals
      location
      result
    }
  }
`;

export const DELETE_MATCH_MUTATION = gql`
  mutation DeleteMatch($id: String!) {
    removeMatch(id: $id) {
      id
    }
  }
`;
