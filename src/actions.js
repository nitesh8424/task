// actions.js
import { LOGIN_USER, LOGOUT_USER, SEARCH_VALUE } from './actionTypes';

export const loginUser = (userData) => ({
  type: LOGIN_USER,
  payload: userData,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});

export const searchValue = (searchValue) => ({
  type: SEARCH_VALUE,
  payload: searchValue,
});

// export const selectedImage = (imageId) => ({
//   type: SELECTED_IMAGE,
//   payload: imageId,
// });
    