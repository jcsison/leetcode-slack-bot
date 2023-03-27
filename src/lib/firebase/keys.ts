export const DB_FILTER_KEY = {
  USER_ID_QUESTION_ID: 'userId_questionId'
} as const;

export const DB_KEY = {
  INSTALLATIONS: 'installations',
  POST_QUESTION: 'postQuestion',
  QUESTIONS: 'questions',
  SUBMITTED_SOLUTIONS: 'submittedSolutions'
};

export const DB_INSTALLATION_KEY = {
  BOT: 'bot',
  INCOMING_WEBHOOK: 'incomingWebhook',
  TEAM: 'team'
};

export const DB_TYPE_KEY = {
  CHANNELS: 'channels',
  FILTERS: '_filters',
  MESSAGES: 'messages',
  USERS: 'users'
};

export const DB_VALUE_KEY = {
  CHANNEL_ID: 'channelId',
  ID: 'id',
  USER_ID: 'userId'
};
