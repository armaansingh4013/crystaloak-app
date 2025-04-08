// import React, { useContext } from 'react'
// import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import { AuthContext } from '../components/AuthContext';

// const Setting = () => {

//     const { logout } = useContext(AuthContext);
// const handleLogout=async()=>{
// await logout()
// }
// return (
//   <View style={styles.container}>
//     <View style={styles.header}>
//       <Image source={{ uri: "https://via.placeholder.com/50" }} style={styles.profileImage} />
//       <View>
//         <Text style={styles.userName}>kajal</Text>
//         <Text style={styles.userDesignation}>Trial Designation</Text>
//       </View>
//     </View>
//     <ScrollView>
//       {menuItems.map((item, index) => (
//         <TouchableOpacity onPress={handleLogout} key={index} style={styles.menuItem}>
//           <Text style={styles.menuText}>{item}</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   </View>
// );
// };

// const menuItems = [
// "Profile",
// "User Guide",
// "Tutorial",
// "Language",
// "Rate Us",
// "Share",
// "Clean Up",
// "About",
// "Log out",
// ];

// const styles = StyleSheet.create({
// container: {
//   flex: 1,
//   backgroundColor: "#fff",
//   paddingVertical: 20,
//   paddingHorizontal: 15,
// },
// header: {
//   flexDirection: "row",
//   alignItems: "center",
//   marginBottom: 20,
//   backgroundColor: "#1E8C68",
//   padding: 15,
//   borderRadius: 10,
// },
// profileImage: {
//   width: 50,
//   height: 50,
//   borderRadius: 25,
//   marginRight: 10,
// },
// userName: {
//   fontSize: 16,
//   fontWeight: "bold",
//   color: "#fff",
// },
// userDesignation: {
//   fontSize: 12,
//   color: "#fff",
// },
// menuItem: {
//   paddingVertical: 15,
//   borderBottomWidth: 1,
//   borderBottomColor: "#ccc",
// },
// menuText: {
//   fontSize: 16,
//   color: "#333",
// },
// });
// export default Setting


import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import color from "../styles/globals"
import { getUserData, storeUserData } from '../components/Storage';
import getProfile from '../controller/profile';
const Setting = () => {
  const { logout } = useContext(AuthContext);
const [user,setUser] = useState()
useEffect(() => {
 const fetchUser =async()=>{
  let userData = await getUserData()
  if (!userData){
    const res = await getProfile();
    storeUserData(res)
    userData = res
  }
  console.log(user)
  setUser(userData)
 }
 fetchUser()
}, [])

const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      {/* Top Blue Section */}
      <View style={styles.topSection}>
        <Text style={styles.heading}>Settings</Text>
        <View style={styles.profile}>
          <Image source={{ uri: 'https://via.placeholder.com/50' }} style={styles.profileImage} />
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
              onPress={item.title === 'Log out' ? handleLogout : () => {}}
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
    paddingTop: 80,
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
    marginTop: -80,
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
