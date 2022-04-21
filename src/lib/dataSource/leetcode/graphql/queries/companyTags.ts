import { gql } from 'graphql-request';

export const companyTags = gql`
  query questionCompanyTags {
    companyTags {
      id
      name
      slug
    }
  }
`;
