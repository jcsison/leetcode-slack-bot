import { Maybe } from './index.js';

interface AuthedUser {
  access_token: Maybe<string>;
  id: Maybe<string>;
  scope: Maybe<string>;
  token_type: Maybe<string>;
}

interface IncomingWebhook {
  channel: Maybe<string>;
  channel_id: Maybe<string>;
  configuration_url: Maybe<string>;
  url: Maybe<string>;
}

interface ResponseMetadata {
  warnings: Maybe<string[]>;
}

interface Team {
  id: Maybe<string>;
  name: Maybe<string>;
}

export interface OAuthResponse {
  access_token: Maybe<string>;
  app_id: Maybe<string>;
  authed_user: Maybe<AuthedUser>;
  bot_user_id: Maybe<string>;
  error: Maybe<string>;
  incoming_webhook: Maybe<IncomingWebhook>;
  ok: Maybe<boolean>;
  response_metadata: Maybe<ResponseMetadata>;
  scope: Maybe<string>;
  status: Maybe<number>;
  team: Maybe<Team>;
  warning: Maybe<string>;
}
