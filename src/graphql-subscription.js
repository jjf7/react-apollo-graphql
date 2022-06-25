import { gql } from "@apollo/client";

export const NEW_VALUE = gql`
  subscription {
    newValue {
      info
      BTC_Bs
    }
  }
`;
