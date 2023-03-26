import { Requests } from '../requests/index.js';

export const getCompanyTags = async () => {
  const companyTags = await Requests.companyTags();
  return companyTags ?? undefined;
};
