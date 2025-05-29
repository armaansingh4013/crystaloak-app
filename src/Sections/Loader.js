import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Loader = ({ message = "Loading..." }) => {
  return (
    <View style={styles.wrapper}>
    {/*    <View style={styles.loaderContainer}>
       <ActivityIndicator size="large" color="#4F46E5" />
         <Text style={styles.message}>{message}</Text>
       </View> */}
    <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4f46e5" />
            <Text style={{ marginTop: 10, color: '#555' }}>Loading ...</Text>
          </View>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    zIndex:99999,
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 100,
    backgroundColor: '#F3F4F6', // light gray circle background
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: '#374151',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
