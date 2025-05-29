import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import TabNavigator from './TabNavigator';
import { getToken, getUserData } from '../components/Storage';
import AdminNavigator from './AdminNavigator';
import { AuthContext } from '../components/AuthContext';
import WorkImagesPreview from '../screens/WorkImagesPreview';
import Sites from '../screens/Sites';
import Employees from '../screens/Employees';
import Toast from 'react-native-toast-message';
import ServiceManagerScreen from '../screens/ServiceManagerScreen';
import FeedbackListScreen from '../screens/FeedbackListScreen';
import QueryListScreen from '../screens/QueryListScreen';
import SiteHolidayScreen from '../screens/SiteHolidayScreen';
import EditServiceScreen from '../screens/EditServiceScreen';
import AttendanceDetails from '../screens/AttendanceDetails';
import ShiftScreen from '../screens/ShiftScreen';
import HolidaysScreen from '../screens/HolidaysScreen';
import Profile from '../screens/Profile';
import AdminEditEmployee from '../screens/AdminEditEmployee';
import Estimations from '../screens/Estimations';
import EstimationDetails from '../screens/EstimationDetails';
import DocumentUpload from '../screens/DocumentUpload';
import PaySlipSelection from '../screens/PaySlipSelection';
import PaySlipDetails from '../screens/PaySlipDetails';
import PaySlipView from '../screens/PaySlipView';
import getProfile from '../controller/profile';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const { user } = useContext(AuthContext);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('Starting auth check...');
      try {
        const token = await getToken();
        console.log('Token retrieved:', !!token);
        const userData = await getProfile();
        console.log('User data retrieved:', userData?.data?.role);
        
        if (token) {
          if (userData?.data.role === 'admin') {
            console.log('Setting route to AdminNavigator');
            setInitialRoute('AdminNavigator');
          } else if (!userData.data.documents) {
            console.log('Setting route to DocumentUpload');
            setInitialRoute('DocumentUpload');
          } else {
            console.log('Setting route to TabNavigator');
            setInitialRoute('TabNavigator');
          }
        } else {
          console.log('No token found, setting route to Login');
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        setInitialRoute('Login');
      }
    };

    checkAuth();
  }, [user]);

  console.log('Current initialRoute:', initialRoute);

  if (!initialRoute) {
    console.log('No initial route set, returning null');
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
        <Stack.Screen name="AdminNavigator" component={AdminNavigator} />
        <Stack.Screen name="WorkImagesPreview" component={WorkImagesPreview} />
        <Stack.Screen name="Sites" component={Sites} />
        <Stack.Screen name="Employees" component={Employees} />
        <Stack.Screen name="ServiceManagerScreen" component={ServiceManagerScreen} />
        <Stack.Screen name="FeedbackListScreen" component={FeedbackListScreen} />
        <Stack.Screen name="QueryListScreen" component={QueryListScreen} />
        <Stack.Screen name="SiteHolidayScreen" component={SiteHolidayScreen} />
        <Stack.Screen name="EditServiceScreen" component={EditServiceScreen} />
        <Stack.Screen name="AttendanceDetails" component={AttendanceDetails} />
        <Stack.Screen name="ShiftScreen" component={ShiftScreen} />
        <Stack.Screen name="HolidaysScreen" component={HolidaysScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AdminEditEmployee" component={AdminEditEmployee} />
        <Stack.Screen name="Estimations" component={Estimations} />
        <Stack.Screen name="EstimationDetails" component={EstimationDetails} />
        <Stack.Screen name="DocumentUpload" component={DocumentUpload} />
        <Stack.Screen name="PaySlipSelection" component={PaySlipSelection}/>
        <Stack.Screen name="PaySlipDetails" component={PaySlipDetails}/>
        <Stack.Screen name="PaySlipView" component={PaySlipView}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
