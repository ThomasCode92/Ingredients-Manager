import React, { createContext, useState } from 'react';

export const AuthContext = createContext({
  isAuth: false,
  login: () => {},
});

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  const authContextValue = { isAuth: isAuthenticated, login: loginHandler };

  return (
    <AuthContext.Provider value={authContextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
