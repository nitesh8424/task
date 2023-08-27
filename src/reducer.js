// reducer.js
import { LOGIN_USER, LOGOUT_USER, SEARCH_VALUE } from "./actionTypes";

const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      console.log("actionPayload", action.payload);
      return {
        ...state,
        user: action.payload,
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
      };
    case SEARCH_VALUE:
        console.log('searchValuuuuue', action.payload)
      return {
        ...state,
        searchValue: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
