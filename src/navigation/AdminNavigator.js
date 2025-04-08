import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../screens/Home';
import { Ionicons } from '@expo/vector-icons';
import Setting from '../screens/Setting';
import Profile from '../screens/Profile';
import Attendance from '../screens/Attendance';
import WorkImages from '../screens/WorkImages';
import colorGlobal from "../styles/globals"
import AdminHome from '../screens/AdminHome';
import AdminAttendance from '../screens/AdminAttendance';
import AdminReport from '../screens/AdminReport';
import Header from '../Sections/Header';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

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
        component={WorkImages} 
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
        component={Setting} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
   </>
  );
}

export default AdminNavigator;
