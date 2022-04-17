import { Maybe } from '.';

export interface ResponseMetadata {
  warnings: Maybe<string[]>;
}

export interface OAuthResponse {
  error: Maybe<string>;
  ok: Maybe<boolean>;
  status: Maybe<number>;
  warning: Maybe<string>;
  response_metadata: Maybe<ResponseMetadata>;
}
