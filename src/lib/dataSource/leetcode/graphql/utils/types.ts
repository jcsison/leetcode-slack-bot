import { Maybe } from '../../../../utils/types/index.js';

export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLError {
  message: string;
  locations: GraphQLErrorLocation[];
  path: string[];
}

export interface GraphQLData<T> {
  [x: string]: Maybe<T>;
}
