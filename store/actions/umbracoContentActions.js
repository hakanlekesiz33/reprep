
import * as actionTypes from './actionTypes';
import * as config from '../../config'
import https from 'https'
import axios from 'axios'
export const umbracoContentRequestSuccess = results => ({ type: actionTypes.SET_UMBRACOCONTENT, results });
export const umbracoContentRequestError = errors => ({ type: actionTypes.FETCH_UMBRACOCONTENT_FAILED, errors });

export const fetchUmbracoContent = () => {
  return async (dispatch) => {
    const agent = new https.Agent({
      rejectUnauthorized: false
    })
    const res = await axios.get(config.getUmbracoContent, { httpsAgent: agent })
    if (res.status === 200) {
      return dispatch(umbracoContentRequestSuccess(res.data));
    } else {
      return dispatch(umbracoContentRequestError([res.data]));
    }
  };
};
