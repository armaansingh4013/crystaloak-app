import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import color from "../styles/globals"
import { getUserData, storeUserData } from '../components/Storage';
import getProfile from '../controller/profile';
import { base_url } from '../api';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
const screenHeight = Dimensions.get('window').height;

const Setting = () => {
  const { logout } = useContext(AuthContext);
const [user,setUser] = useState()
const navigation = useNavigation()
useEffect(() => {
 const fetchUser =async()=>{
  try {
    const res = await getProfile();
    if (res.success) {
      setUser(res.data);
    } else {
      Toast.show({
        type: 'error',
        text1: 'Failed to fetch profile',
        text2: res.message || 'Please try again',
        position: 'top',
      });
    }
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Failed to fetch profile',
      text2: 'Please try again',
      position: 'top',
    });
  }
 }
 fetchUser()
}, [])

const handleLogout = async () => {
    try {
      await logout();
      Toast.show({
        type: 'success',
        text1: 'Logged out successfully',
        position: 'top',
      });
      navigation.replace("Login");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: 'Please try again',
        position: 'top',
      });
    }
};

  return (
    <View style={styles.container}>
      {/* Top Blue Section */}
      <View style={styles.topSection}>
        <Text style={styles.heading}>Settings</Text>
        <View style={styles.profile}>
          <Image source={{ uri: (user&&user.profileImage.imageUrl) }} style={styles.profileImage} />
          <View>
            <Text style={styles.userName}>{user&&user.name}</Text>
            <Text style={styles.userDesignation}>{user&&user.designation}</Text>
          </View>
        </View>
      </View>

      {/* White Overlapping Card Section */}
      
      <View style={styles.cardContainer}>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.cardItem}
              onPress={item.title === 'Log out' ? handleLogout : () => {navigation.navigate(item.title)}}
            >
              <View style={styles.iconWrapper}>{item.icon}</View>
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const menuItems = [
  { title: 'Profile', icon: <Ionicons name="person" size={20} color= {color.primary} /> },
  { title: 'Tutorial', icon: <MaterialIcons name="book" size={20} color={color.primary} /> },
  { title: 'About', icon: <FontAwesome name="building" size={20} color={color.primary} /> },
  { title: 'Log out', icon: <Ionicons name="log-out-outline" size={20} color="#e53935" /> },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    height: '40%',
    paddingHorizontal: 40,
    paddingTop: 40,
    backgroundColor: color.primary,
  },
  heading: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:15
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  userDesignation: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -(screenHeight * 0.05),
    margin:20,
    borderRadius: 25,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  iconWrapper: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Setting;
