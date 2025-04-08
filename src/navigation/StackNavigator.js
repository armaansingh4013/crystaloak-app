import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login';
import TabNavigator from './TabNavigator';
import { getToken, getUserData } from '../components/Storage';
import AdminNavigator from './AdminNavigator';
import { AuthContext } from '../components/AuthContext';
import WorkImagesPreview from '../screens/WorkImagesPreview';

const Stack = createStackNavigator();

const StackNavigator = () => {
  const { token } = useContext(AuthContext);
  console.log(token);
  
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially null to show loading
  const [role,setRole] = useState("user")
  // Function to check token
  const checkAuth = async () => {
    setIsAuthenticated(!!token); // Convert token existence to boolean
  };
const checkRole = async ()=>{
  const user = await getUserData()
  console.log(user);
  
  setRole(user.role)
}
  useEffect(() => {
    checkAuth();
    checkRole()
  }, [token]);

  if (isAuthenticated === null) {
    return null; // Or a loading spinner while checking token
  }
console.log(role)
  return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={token != null ? "Main" : "Login"}>
     
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Main" component={role==="user"?TabNavigator:AdminNavigator} />
      <Stack.Screen name="workimagespreview" component={WorkImagesPreview}/>
    </Stack.Navigator>
  </NavigationContainer>
);
};

export default StackNavigator;
