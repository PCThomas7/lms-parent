import { View, Image, StyleSheet, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

// Initialize splash screen
SplashScreen.preventAutoHideAsync().catch(() => {});

const window = Dimensions.get('window');

const LoadingScreen = () => {
  useEffect(() => {
    // Hide the native splash screen after your custom splash is ready
    const hideSplash = async () => {
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splashScreen/splash.png')}
        style={styles.splashImage}
        resizeMode="contain"
        onLoad={() => SplashScreen.hideAsync()} // Hide when image loads
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashImage: {
    width: window.width * 1.2,
    height: window.height * 1,
  },
});

export default LoadingScreen;