"use client";

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  createHttpLink,
  from,
  InMemoryCache,
  Observable,
} from "@apollo/client";
import { Env } from "@/lib/config";
import { FC, PropsWithChildren } from "react";
import { onError } from "@apollo/client/link/error";
import { authService } from "@/lib/auth/AuthService";
import { firstValueFrom } from "rxjs";

const httpLink = createHttpLink({
  uri: Env.ServerUrl + "/graphql",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        console.error("Unauthorized! Redirecting to login...");

        authService.logout().then(() => {
          window.location.href = "/login";
        });
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const authLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    firstValueFrom(authService.tokenStorage.data$)
      .then((token) => {
        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
          },
        }));
      })
      .finally(() => {
        const subscriber = forward(operation).subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });

        return () => subscriber.unsubscribe();
      });
  });
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const Apollo: FC<PropsWithChildren> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default Apollo;
