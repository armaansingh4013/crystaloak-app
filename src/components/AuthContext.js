// AuthContext.js
import React, {createContext, useEffect, useState} from 'react';
import {getToken, removeToken, storeToken} from './Storage';

export const AuthContext = createContext ();

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState (null);
  const [loading, setLoading] = useState (true);

  const loadToken = async () => {
    const storedToken = await getToken ();
    if (storedToken) {
      setToken (storedToken);
    }
    setLoading (false);
  };

  useEffect (() => {
    loadToken ();
  }, []);

  const login = async tokenValue => {
    await storeToken (tokenValue);
    setToken (tokenValue);
  };

  const logout = async () => {
    await removeToken ();
    setToken (null);
  };

  return (
    <AuthContext.Provider value={{token, login, logout}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
