import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../screens/Home';
import { Ionicons } from '@expo/vector-icons';
import Attendance from '../screens/Attendance';
import WorkImages from '../screens/WorkImages';
import colorGlobal from "../styles/globals"
import AdminHome from '../screens/AdminHome';
import AdminAttendance from '../screens/AdminAttendance';
import AdminReport from '../screens/AdminReport';
import Header from '../Sections/Header';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminSettings from '../screens/AdminSettings';
import AdminAddEmployee from '../screens/AdminAddEmployee';
import { createStackNavigator } from '@react-navigation/stack';
import ShiftScreen from '../screens/ShiftScreen';
import HolidaysScreen from '../screens/HolidaysScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AdminNavigator = () => {
  const navigation = useNavigation()
  return (
   <>
  
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white', paddingBottom: 5 },
        headerShown: false
      }}
    >
     
      <Tab.Screen 
        name="Home" 
        component={AdminHome} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
        <Tab.Screen 
        name="Attendance" 
        component={AdminAttendance} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />
        }} 
      /> 
      <Tab.Screen 
        name="Add Employee" 
        component={AdminAddEmployee} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />
        }} 
      />
       <Tab.Screen 
        name="Report" 
        component={AdminReport} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }} 
      />
      
     
      
      <Tab.Screen 
        name="Settings" 
        component={AdminSettings} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
   </>
  );
}

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AdminHome" component={AdminHome} />
      <Stack.Screen name="AdminAttendance" component={AdminAttendance} />
      <Stack.Screen name="AddEmployee" component={AdminAddEmployee} />
      <Stack.Screen name="AdminReport" component={AdminReport} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
      <Stack.Screen name="shift" component={ShiftScreen} />
      <Stack.Screen name="holidays" component={HolidaysScreen} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;
