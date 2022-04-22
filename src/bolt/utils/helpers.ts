export const parseHandleFromMessage = (text: string) => {
  const capturedUrl = text.match(/<(\S+\/\S+)>/g)?.[0];
  const urlParts = capturedUrl
    ?.replace(/[<>\s]/g, '')
    .split('/')
    .filter(s => !!s);
  return urlParts?.[urlParts.length - 1];
};

export const parseUrlFromMessage = (text: string) => {
  const capturedUrl = text.match(/<(\S+\/\S+)>/g)?.[0];
  return capturedUrl?.replace(/[<>\s]/g, '');
};
