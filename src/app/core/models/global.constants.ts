export const ROUTE_PATH = {
  login: '/login',
  register: '/register',
  home: 'home',
  forgotPassword: 'reset-password',
  category: '/categories',
};

export const GLOBAL_CONSTANTS = {
  idToken: 'id_token',
  emailCookieName: 'email',
  rememberMe: 'rememberMe',
  expiredTime: 'expiredTime',
  wss_api: 'https://localhost',

  auth_api: "auth",
  register_api: "api/v1/register",
};

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD-3sIU1ddfA_-lydnJKsRBpamFFOfOrTg",
  authDomain: "wedding-service-wss.firebaseapp.com",
  projectId: "wedding-service-wss",
  storageBucket: "wedding-service-wss.appspot.com",
  messagingSenderId: "716165936197",
  appId: "1:716165936197:web:e40a8a74cbcb8c72521f2c",
  measurementId: "G-40XM8B81K2"
};

export const ENDPOINTS = {
  login: `${GLOBAL_CONSTANTS.auth_api}/userInfo`,
};
