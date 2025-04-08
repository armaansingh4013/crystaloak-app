import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Store token
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('user_token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Get token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('user_token');
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
};

// Remove token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('user_token');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Store user data
export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('user_data', JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

// Get user data
export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem('user_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

// Remove user data (logout)
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem('user_data');
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};
