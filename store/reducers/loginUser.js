import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isAuth: false,
  user: null,
  profileImage:null
}

function loginUser(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_USER_INFO: {
      return {
        ...state,
        isAuth: true,
        ...action.results,
      };
    }
    case actionTypes.SET_USER_PROFILE_IMAGE: {
      return {
        ...state,
        isAuth: true,
        ...action.profileImage,
      };
    }

    default:
      return state;
  }
}

export default loginUser;
