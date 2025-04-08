
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import color from '../styles/globals';
import getProfile from '../controller/profile';
import { getUserData } from '../components/Storage';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Profile = () => {
  const [data, setData] = useState(getUserData());

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getProfile();
      if (res.success) {
        setData(res.data);
      }
    };
    fetchProfile();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.body}>
      <View style={styles.headerSection}>
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'data:image/jpeg;base64,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' }}
            style={styles.profileImage}
          />
        </View>
      </View>
      <View style={styles.card}>
        

        

        {/* Name and Designation */}
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.designation}>{data.designation}</Text>

        {/* Info Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Info</Text>
          <Text style={styles.info}><Text style={styles.label}>Employee Code:</Text> {data.employeeCode}</Text>
          <Text style={styles.info}><Text style={styles.label}>Full Name:</Text> {data.name}</Text>
          <Text style={styles.info}><Text style={styles.label}>Department:</Text> {data.department}</Text>
          <Text style={styles.info}><Text style={styles.label}>Designation:</Text> {data.designation}</Text>
          <Text style={styles.info}><Text style={styles.label}>Shift Timings:</Text> 09:00 - 18:00</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <Text style={styles.info}><Text style={styles.label}>Phone:</Text> {data.phoneNumber}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  body: {
    flexGrow: 1,
    backgroundColor: color.primary,
    alignItems: 'center',
    padding: 20,
  },
  headerSection:{
    height:screenHeight * 0.20,
    position:"relative",
    width: screenWidth > 500 ? 450 : screenWidth * 0.95,

  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 25,
    paddingTop:70,
    width: screenWidth > 500 ? 450 : screenWidth * 0.95,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    alignItems: 'center',
    height:  screenHeight * 0.65,
  },
  header: {
    backgroundColor: '#6c47ff',
    width: '100%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: color.primaryLight,
    marginBottom: 15,
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    zIndex: 99,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode:"contain"
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 5,
  },
  designation: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 15,
  },
  section: {
    width: '100%',
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#6c47ff',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    color: '#374151',
    marginVertical: 2,
  },
  label: {

    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
});

export default Profile;
