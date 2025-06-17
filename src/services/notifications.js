import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import API from '../api';
import { getToken, getUserData } from '../components/Storage';
import Toast from 'react-native-toast-message';
import { PermissionsAndroid } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const getDeviceInfo = async () => {
  const deviceType = Platform.OS;
  const deviceInfo = `${Device.modelName} ${Device.osVersion}`;
  // Create a unique device ID using available device properties
  const deviceId = `${Device.manufacturer}-${Device.modelName}-${Device.osVersion}-${Device.platformApiLevel}`.replace(/\s+/g, '-');
  return { deviceId, deviceType, deviceInfo };
};

export const registerForPushNotificationsAsync = async () => {
  // if (!Constants.isDevice) {
  //   console.log('Must use physical device for Push Notifications');
  //   return null;
  // }

  // Request notification permission for Android 13+
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission denied');
        return null;
      }
    } catch (err) {
      console.warn('Error requesting notification permission:', err);
      return null;
    }
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token');
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
};

export const savePushToken = async (expoPushToken) => {
  try {
    const { deviceId, deviceType, deviceInfo } = await getDeviceInfo();
    const authToken = await getToken();
    const user = await getUserData();

    const response = await fetch(API.saveToken, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userId: user.id,
        expoPushToken,
        deviceId,
        deviceType,
        deviceInfo,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save push token');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving push token:', error);
    Toast.show({
      type: 'error',
      text1: 'Notification Error',
      text2: 'Failed to set up notifications. Please try again.',
      position: 'top',
    });
    throw error;
  }
};

export const removePushToken = async (deviceId) => {
  try {
    const authToken = await getToken();
    
    const response = await fetch(`${API.deleteToken}/${deviceId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to remove push token');
    }

    return await response.json();
  } catch (error) {
    console.error('Error removing push token:', error);
    throw error;
  }
};

export const getRegisteredDevices = async () => {
  try {
    const authToken = await getToken();
    
    const response = await fetch(API.getDevices, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get registered devices');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting registered devices:', error);
    throw error;
  }
}; 