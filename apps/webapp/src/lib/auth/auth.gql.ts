import { gql } from "@apollo/client";

export const LoginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(loginInput: { username: $username, password: $password }) {
      user {
        id
        username
      }
      token
    }
  }
`;

export const RegisterMutation = gql`
  mutation Register($username: String!, $password: String!) {
    register(registerInput: { username: $username, password: $password }) {
      user {
        id
        username
      }
      token
    }
  }
`;
