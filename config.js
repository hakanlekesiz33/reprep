
const isTest = false
const localApi = "https://localhost:5001"
const aliveApi = "http://reprep.api.feux.digital"
const apiUrl = isTest ? localApi : aliveApi

export const tfmRepairUrl="http://tfmrepair.de"

export const waitToNextComponent = 700;//component değişirken bekletmek istediğimiz
export const translateYTopValue = 75;//

export const expireDate = 0.5;//localstorage tutulacak gün sayısı
export const firmID = 2952; //firmID canlı
//export const firmID = 1000;   //firmID local
export const region = "München";

//asp.net core api
export const getBrands = apiUrl+'/api/TFMServices/getBrands';
export const getModels = 'http://tfmlager.com/Files/Exports/Daily/brands-models.json';
export const countriesJson = 'http://tfmlager.com/Files/Exports/Daily/countries.json';
export const citiesJson = 'http://tfmlager.com/Files/Exports/Daily/cities.json';
export const login = apiUrl+'/api/auth/login';
export const createTicket = apiUrl+'/api/TFMServices/createTicket';
export const register = apiUrl+'/api/auth/register';
export const registerWithAlternativeLogin = apiUrl+'/api/auth/registerWithAlternativeLogin';
export const resetPassword = apiUrl+'/api/auth/resetPassword';
export const confirmPassword = apiUrl+'/api/auth/confirmPassword';
export const changePassword = apiUrl+'/api/user/changePassword';
export const updateUser = apiUrl+'/api/user/updateUser';
export const getUserFiles = apiUrl+'/api/user/GetUserFiles';
export const getUserTickets = apiUrl+'/api/user/getUserTickets?userId=';
export const checkUser =apiUrl+ '/api/auth/checkUser?email=';
export const uploadFile = apiUrl+'/api/TFMServices/uploadFile';
export const deleteFile = apiUrl+'/api/TFMServices/deleteFile';
export const getModelPrices = apiUrl+'/api/TFMServices/getModelPrices';
export const getUserImages = apiUrl+'/api/user/getProfileImage';


//umbraco api
export const getSiteMap = 'http://reprep.umb.feux.digital/Umbraco/Api/Content/GetSiteMap';
export const getUmbracoContent = 'http://reprep.umb.feux.digital/content/json.txt';

