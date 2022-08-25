import * as actionTypes from './actionTypes'

export const setToReduxSiteSettings = results => ({ type: actionTypes.SET_SITE_SETTINGS, results });


export const setSiteSettings = (results) => {
  return async (dispatch) => {
    return dispatch(setToReduxSiteSettings(results))
  };
};
