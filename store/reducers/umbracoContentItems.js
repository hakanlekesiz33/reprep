import * as actionTypes from '../actions/actionTypes';

const initialState = {
  error: false
}

function umbracoContent(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_UMBRACOCONTENT: {
      return {
        ...state,
        ...action.results,
        error: false,
      };
    }
    case actionTypes.FETCH_UMBRACOCONTENT_FAILED: {
      return {
        ...state,
        error: true
      };
    }
    default:
      return state;
  }
}

export default umbracoContent;
