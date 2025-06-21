import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Header from '../Sections/Header';
import { useNavigation } from '@react-navigation/native';
import color from '../styles/globals';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Tutorial = () => {
  const navigation = useNavigation();

  const tutorials = [
    {
      title: 'Marking Attendance',
      videoId: 'YOUR_ATTENDANCE_VIDEO_ID',
      description: 'Learn how to mark your daily attendance using the app.'
    },
    {
      title: 'Uploading Photos',
      videoId: 'YOUR_PHOTO_UPLOAD_VIDEO_ID',
      description: 'Step by step guide to upload work photos and documents.'
    },
    {
      title: 'Viewing Attendance',
      videoId: 'YOUR_VIEW_ATTENDANCE_VIDEO_ID',
      description: 'How to check your attendance history and status.'
    },
    {
      title: 'Managing Profile',
      videoId: 'YOUR_PROFILE_VIDEO_ID',
      description: 'Update your profile information and settings.'
    }
  ];

  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} title="Tutorials" />
      <ScrollView style={styles.scrollView}>
        {tutorials.map((tutorial, index) => (
          <View key={index} style={styles.tutorialCard}>
            <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
            <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
            <View style={styles.videoContainer}>
              <WebView
                style={styles.video}
                source={{ uri: `https://www.youtube.com/embed/${tutorial.videoId}` }}
                allowsFullscreenVideo
                javaScriptEnabled
                domStorageEnabled
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    marginVertical:20
  },
  tutorialCard: {
    backgroundColor: color.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: color.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tutorialTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: color.primary,
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 16,
    color: color.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  videoContainer: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
  },
});

export default Tutorial;
