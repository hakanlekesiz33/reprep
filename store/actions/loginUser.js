import fetch from 'node-fetch'
import * as actionTypes from './actionTypes'
import * as config from '../../config'

export const setUserLoginInfo = results => ({ type: actionTypes.SET_USER_INFO, results });
export const setUserProfileImage = results => ({ type: actionTypes.SET_USER_PROFILE_IMAGE, results });


export const fetchUserInfo = (user) => {
  return async (dispatch) => {
    return dispatch(setUserLoginInfo(user))
  };
};

export const fetchUserProfile = (user) => {
  return async (dispatch) => {
    return dispatch(setUserProfileImage(user))
  };
};
