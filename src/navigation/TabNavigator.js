import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Home from '../screens/Home';
import { Ionicons } from '@expo/vector-icons';
import Setting from '../screens/Setting';
import Profile from '../screens/Profile';
import Attendance from '../screens/Attendance';
import WorkImages from '../screens/WorkImages';
import colorGlobal from "../styles/globals"
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
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
        component={Home} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
       <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }} 
      />
       <Tab.Screen 
        name="Images" 
        component={WorkImages} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />
        }} 
      />
       <Tab.Screen 
        name="Attendance" 
        component={Attendance} 
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />
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
  );
}

export default TabNavigator;
