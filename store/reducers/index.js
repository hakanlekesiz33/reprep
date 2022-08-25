import { combineReducers } from 'redux';
import umbracoContent from './umbracoContentItems';
import siteSettings from './siteSettings';
import requestPageItems from './requestPageItems';
import loginUser from './loginUser';

const rootReducer = combineReducers({
  siteSettings,
  umbracoContent,
  requestPageItems,
  loginUser

});

export default rootReducer;
