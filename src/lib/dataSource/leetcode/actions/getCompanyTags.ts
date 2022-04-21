import { Log } from '../../../utils/helpers';
import { Requests } from '../requests';

export const getCompanyTags = async () => {
  try {
    const companyTags = await Requests.companyTags();
    return companyTags ?? undefined;
  } catch (error) {
    Log.error(error, 'Error fetching company tags');
  }
};
