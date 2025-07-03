import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';

const About = () => {
  const navigation = useNavigation();

  return (
  <View>
  <Header onBackPress={() => navigation.goBack()} title="About Us"/>
    <ScrollView contentContainerStyle={styles.container}>
        
      <Image
        source={require('../assets/DarkLogo.png')} 
        style={styles.logo}
      />

      <Text style={styles.title}>About Crystal Oak Construction</Text>

      <Text style={styles.description}>
        Crystal Oak Construction is a trusted name in the industry with over 20 years of experience delivering high-quality residential and commercial construction services. Our commitment to excellence and customer satisfaction has made us a preferred choice for clients seeking reliable and professional construction solutions.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <Text style={styles.sectionContent}>
          - Residential Construction
          {'\n'}- Commercial Construction
          {'\n'}- Renovations & Remodeling
          {'\n'}- Project Management
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.sectionContent}>
          To deliver exceptional construction services that exceed our clients' expectations, ensuring quality, integrity, and professionalism in every project we undertake.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionContent}>
          📍 Address: London, United Kingdom
          {'\n'}📞 Phone: 079 7005 4444
          {'\n'}📧 Email: crystaloak16@gmail.com
          {'\n'}🌐 Website: www.crystaloak.co.uk
        </Text>
      </View>
    </ScrollView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom:120,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555555',
    marginBottom: 20,
    lineHeight: 22,
  },
  section: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#444444',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
});
