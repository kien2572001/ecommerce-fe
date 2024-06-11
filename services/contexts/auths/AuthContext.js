import React, { createContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import UserServices from "../../api/user-api";

// Initial state
const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

// Action types
const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";
const INITIALIZE = "INITIALIZE";

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext({
  ...initialState,
  dispatch: () => null,
});

// Provider component
const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Initialize the auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("ACCESS_TOKEN");

      if (!accessToken) {
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
        return;
      }

      try {
        const { exp } = jwtDecode(accessToken);

        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("ACCESS_TOKEN");
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, user: null },
          });
        } else {
          const user = await UserServices.fetchMyProfile();
          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user },
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        localStorage.removeItem("access_token");
        dispatch({
          type: INITIALIZE,
          payload: { isAuthenticated: false, user: null },
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (accessToken) => {
    // Save the access token to local storage
    localStorage.setItem("ACCESS_TOKEN", accessToken);

    // Fetch the user data
    try {
      const user = await UserServices.fetchMyProfile();
      if (user) {
        dispatch({
          type: LOGIN,
          payload: { user },
        });
      } else {
        console.error("Failed to fetch user after login:", error);
      }
    } catch (error) {
      console.error("Failed to fetch user after login:", error);
    }
  };

  // Logout function
  const logout = () => {
    // Remove the access token from local storage
    localStorage.removeItem("ACCESS_TOKEN");

    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
