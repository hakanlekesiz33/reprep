import * as actionTypes from '../actions/actionTypes';

const initialState = {
  step1PageStatus: {
    class: '',
    translateYValue1: 0,
    translateYValue2: 0,
    translateYValue3: 0
  },
  step3PageStatus: {
    class: '',
    translateYValue1: 0,
  },
  step4PageStatus: {
    class: '',
    translateYValue1: 0,
  },
  step10PageStatus: {
    class: '',
    insideOfStep: false,
    translateYValue1: 0,
  },
  step12PageStatus: {
    class: '',
    translateYValue1: 0,
  },
  withGrandiant:'',
  isPassActive: '',
  pattern: '',
  passcode: [],
  acceptedFilesGuid: '',
  isFinalPage: false,
  showSummaryModal:false,
  showConfirmModal:false,
  confirmResult:null,
  showLoginModal: false,
  showRegisterModal: false ,
  userRequestSteps: {
    isLogin: false,
    comeFrom:'default'
  },
  currPageLangSettings: {},
  showLayer:false
}

function siteSettings(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_SITE_SETTINGS: {
      return {
        ...state,
        ...action.results
      };
    }

    default:
      return state;
  }
}

export default siteSettings;
