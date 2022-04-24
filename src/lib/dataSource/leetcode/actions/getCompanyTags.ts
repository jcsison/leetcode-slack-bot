import { Requests } from '../requests';

export const getCompanyTags = async () => {
  const companyTags = await Requests.companyTags();
  return companyTags ?? undefined;
};
