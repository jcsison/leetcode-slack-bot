export const parseHandleFromMessage = (text: string) => {
  return [
    ...text.matchAll(/<https:\/\/[a-zA-Z\.]+\/problems\/([^\/<>]+)\S*>/g)
  ]?.[0]?.[1];
};

export const parseUrlFromMessage = (text: string) => {
  return [
    ...text.matchAll(/<(https:\/\/[a-zA-Z\.]+\/problems\/[^\/<>]+)\S*>/g)
  ]?.[0]?.[1];
};
