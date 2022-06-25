import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {
  ApolloClient,
  gql,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";

import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const httpLink = createHttpLink({
  uri: "https://apollo-server-jfdesousa.herokuapp.com",
});

const wsLink = new WebSocketLink({
  uri: "wss://apollo-server-jfdesousa.herokuapp.com/graphql",
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
});

/*
client
  .query({ query })
  .then((res) => console.log(res));

*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
