import React, {useContext, useEffect, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AuthContext} from '../components/AuthContext';
import {Ionicons, MaterialIcons, FontAwesome} from '@expo/vector-icons';
import color from '../styles/globals';
import {getUserData, storeUserData} from '../components/Storage';
import getProfile from '../controller/profile';
import Header from '../Sections/Header';
import {useNavigation} from '@react-navigation/native';
import ShiftScreen from './ShiftScreen';
import HolidaysScreen from './HolidaysScreen';

const AdminSettings = () => {
  const {logout} = useContext (AuthContext);
  const [user, setUser] = useState ();
  const navigation = useNavigation ();
  useEffect (() => {
    const fetchUser = async () => {
      let userData = await getUserData ();
      if (!userData) {
        const res = await getProfile ();
        storeUserData (res);
        userData = res;
      }
      setUser (userData);
    };
    fetchUser ();
  }, []);

  const handleLogout = async () => {
    await logout ();
        navigation.replace("Login")
  };

  return (
    <View style={styles.container}>
      <Header title="Setting" />
      {/* Top Blue Section */}
      <View style={styles.topSection} />

      {/* White Overlapping Card Section */}
      <View style={styles.cardContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('Profile');
            }}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome name="user" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('Sites');
            }}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome name="building" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Sites
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate('Employees');
            }}
          >
            <View style={styles.iconWrapper}>
              <MaterialIcons name="person" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Employees
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('ShiftScreen');
            }}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="time" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Time Shift
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('HolidaysScreen');
            }}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome name="calendar" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Holidays
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('FeedbackListScreen');
            }}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="book" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Feedbacks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('QueryListScreen');
            }}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome name="comment" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Queries
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('Estimations');
            }}
          >
             <View style={styles.iconWrapper}>
              <FontAwesome name="comment" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Estimations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate ('ServiceManagerScreen');
            }}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome name="photo" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardItem}
            onPress={() => {
              navigation.navigate('PaySlipSelection');
            }}
          >
            <View style={styles.iconWrapper}>
              <FontAwesome name="money" size={20} color={color.primary} />
            </View>
            <Text style={styles.cardText}>
              Pay Slip
            </Text>
          </TouchableOpacity>
         
          <TouchableOpacity style={styles.cardItem} onPress={handleLogout}>
            <View style={styles.iconWrapper}>
              <Ionicons name="log-out-outline" size={20} color="#e53935" />
            </View>
            <Text style={styles.cardText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create ({
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
    marginVertical: 15,
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
    marginTop: Platform.OS === 'ios' ? -320 : -250,
    margin: 20,
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default AdminSettings;
