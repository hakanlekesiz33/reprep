import * as actionTypes from '../actions/actionTypes';

const initialState = {
  error: false,
  isModelsFetched:false
}

function requestPageItems(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_REQUEST_PAGE_MODELS: {
      return {
        ...state,
        modelList:action.results,
        error: false,
        isModelsFetched:true
      };
    }
    case actionTypes.FETCH_REQUEST_PAGE_FAILED: {
      return {
        ...state,
        error: true
      };
    }
    default:
      return state;
  }
}

export default requestPageItems;
