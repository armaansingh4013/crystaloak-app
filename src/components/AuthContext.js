// AuthContext.js
import React, {createContext, useEffect, useState} from 'react';
import {getToken, removeToken, storeToken, removeUserData} from './Storage';
import {removePushToken, getDeviceInfo} from '../services/notifications';

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
    try {
      // Get device info to remove push token
      const { deviceId } = await getDeviceInfo();
      
      // Remove push token from server
      if (deviceId) {
        await removePushToken(deviceId);
      }
    } catch (error) {
      console.error('Error removing push token during logout:', error);
      // Continue with logout even if push token removal fails
    }
    
    // Clear local storage
    await removeToken();
    await removeUserData();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{token, login, logout}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
