import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  gql,
  useQuery,
  useSubscription,
  useApolloClient,
} from "@apollo/client";
import { NEW_VALUE } from "./graphql-subscription";

const query = gql`
  query {
    prices {
      info
      BTC_Bs
    }
  }
`;

const useCoin = (query) => {
  const result = useQuery(query);
  return result;
};

function App() {
  const { data, error, loading } = useCoin(query);

  const client = useApolloClient();

  useSubscription(NEW_VALUE, {
    onSubscriptionData: ({ subscriptionData }) => {
      const { newValue } = subscriptionData.data;

      const dataInStore = client.readQuery({ query });

      client.writeQuery({
        query,
        data: {
          ...dataInStore,
          prices: newValue,
        },
      });
    },
  });

  //const results = client.readQuery({ query });
  //console.log("cache: ", results);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  //console.log("data", data)

  const color = () => {
    return data.prices.info === "Up" ? "green" : "red";
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loading ? (
          ""
        ) : (
          <>
            <p>Price of BTC</p>
            
            <div>
              {data && (
                <p>
                  BTC: {<b style={{ color: color() }}>{parseFloat(data.prices.BTC_Bs).toFixed(2)}</b>}{" "}
                  $usd
                </p>
              )}
            </div>

            <small>Development by JFdeSousa.</small>
            <small style={{fontSize: "12px"}}>NodeJs + GraphQL(Apollo) + ReactJs</small>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
