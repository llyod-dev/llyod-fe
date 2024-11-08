"use client";

import React, { createContext, useReducer } from "react";

const initialState = {
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {

    case "UPDATE_USER":
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

export const AppContext = createContext({
  state: initialState,
  dispatch: () => null,
});

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
