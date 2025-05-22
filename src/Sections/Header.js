import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import color from "../styles/globals"

const Header = ({ title, onBackPress, rightComponent }) => {
  return (
    <>
    <StatusBar
      backgroundColor={color.primary}
      barStyle="light-content"
    />
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
        {/* Left */}
        <View style={styles.side}>
          {onBackPress && (
            <TouchableOpacity onPress={onBackPress}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center */}
        <View style={styles.center}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Right */}
        <View style={styles.side}>
          {rightComponent && rightComponent}
        </View>
      </View>
    </SafeAreaView></>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: color.primary,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  side: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: "white"
  },
});

export default Header;
