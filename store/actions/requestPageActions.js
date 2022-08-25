import fetch from 'node-fetch'
import * as actionTypes from './actionTypes'
import * as config from '../../config'
import https from 'https'
import axios from 'axios'

export const setModels = results => ({ type: actionTypes.SET_REQUEST_PAGE_MODELS, results });
export const PageRequestError = errors => ({ type: actionTypes.FETCH_REQUEST_PAGE_FAILED, errors });

export const fetchModels = () => {
  return async (dispatch) => {
    const response = await fetch(config.getModels);
    const results = await response.json();
    if (response.status === 200) {
      return dispatch(setModels(results));
    } else {
      return dispatch(PageRequestError([results]));
    }
  };
};


