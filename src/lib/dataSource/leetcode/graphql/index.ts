import { GraphQLClient, RequestDocument, Variables } from 'graphql-request';

import { GraphQLData } from './utils/types.js';
import { uri } from './config.js';

const client = new GraphQLClient(uri.base + '/graphql');

export const graphQLRequest = async <T>(
  key: string,
  query: RequestDocument,
  variables?: Variables
) => {
  const data = await client.request<GraphQLData<T>>(query, variables);
  return data[key];
};
