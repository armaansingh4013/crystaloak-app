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
    await AsyncStorage.multiRemove([
      'user_data',
      'user_token',
      'sites_data',
      'attendance_status',
      'attendance_data',
    ]);
  } catch (error) {
    console.error('Error removing user data:', error);
  }
};

// Store sites data
export const storeSitesData = async (sitesData) => {
  try {
    await AsyncStorage.setItem('sites_data', JSON.stringify(sitesData));
  } catch (error) {
    console.error('Error storing sites data:', error);
  }
};

// Get sites data
export const getSitesData = async () => {
  try {
    const data = await AsyncStorage.getItem('sites_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching sites data:', error);
    return null;
  }
};

// Remove sites data
export const removeSitesData = async () => {
  try {
    await AsyncStorage.removeItem('sites_data');
  } catch (error) {
    console.error('Error removing sites data:', error);
  }
};

// Store attendance status
export const storeAttendanceStatus = async (attendanceStatus) => {
  try {
    await AsyncStorage.setItem('attendance_status', JSON.stringify(attendanceStatus));
  } catch (error) {
    console.error('Error storing attendance status:', error);
  }
};

// Get attendance status
export const getAttendanceStatusStorage = async () => {
  try {
    const data = await AsyncStorage.getItem('attendance_status');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching attendance status:', error);
    return null;
  }
};

// Remove attendance status
export const removeAttendanceStatus = async () => {
  try {
    await AsyncStorage.removeItem('attendance_status');
  } catch (error) {
    console.error('Error removing attendance status:', error);
  }
};

// Store attendance data (full list)
export const storeAttendanceData = async (attendanceData) => {
  try {
    await AsyncStorage.setItem('attendance_data', JSON.stringify(attendanceData));
  } catch (error) {
    console.error('Error storing attendance data:', error);
  }
};

// Get attendance data (full list)
export const getAttendanceData = async () => {
  try {
    const data = await AsyncStorage.getItem('attendance_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    return null;
  }
};

// Remove attendance data
export const removeAttendanceData = async () => {
  try {
    await AsyncStorage.removeItem('attendance_data');
  } catch (error) {
    console.error('Error removing attendance data:', error);
  }
};

// Store attendance data by date
export const storeAttendanceByDate = async (date, attendanceData) => {
  try {
    const key = `attendance_${date}`;
    await AsyncStorage.setItem(key, JSON.stringify(attendanceData));
  } catch (error) {
    console.error('Error storing attendance data by date:', error);
  }
};

// Get attendance data by date
export const getAttendanceByDate = async (date) => {
  try {
    const key = `attendance_${date}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching attendance data by date:', error);
    return null;
  }
};

// Remove attendance data by date
export const removeAttendanceByDate = async (date) => {
  try {
    const key = `attendance_${date}`;
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing attendance data by date:', error);
  }
};

// Store dashboard data
export const storeDashboardData = async (dashboardData) => {
  try {
    await AsyncStorage.setItem('dashboard_data', JSON.stringify(dashboardData));
  } catch (error) {
    console.error('Error storing dashboard data:', error);
  }
};

// Get dashboard data
export const getDashboardData = async () => {
  try {
    const data = await AsyncStorage.getItem('dashboard_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return null;
  }
};

// Remove dashboard data
export const removeDashboardData = async () => {
  try {
    await AsyncStorage.removeItem('dashboard_data');
  } catch (error) {
    console.error('Error removing dashboard data:', error);
  }
};

// Generic store data
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
  }
};

// Generic get data
export const getData = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error fetching data for key ${key}:`, error);
    return null;
  }
};

// Generic remove data
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key ${key}:`, error);
  }
};

// Chats storage helpers
export const storeChats = async (chats) => storeData('chats', chats);
export const getChats = async () => getData('chats');
export const removeChats = async () => removeData('chats');

// Employees storage helpers
export const storeEmployees = async (employees) => storeData('employees', employees);
export const getEmployees = async () => getData('employees');
export const removeEmployees = async () => removeData('employees');

// Per-user chat history helpers
export const storeChatHistory = async (userId, messages) => storeData(`chat_history_${userId}`, messages);
export const getChatHistory = async (userId) => getData(`chat_history_${userId}`);
export const removeChatHistory = async (userId) => removeData(`chat_history_${userId}`);
