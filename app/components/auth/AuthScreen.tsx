import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Login from './login';
import Signup from './signup';

const { height } = Dimensions.get('window');

export default function AuthScreen() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header Image Section */}
      <View style={authStyles.headerContainer} className="bg-pink-100 justify-center items-center overflow-hidden">
        <Image
          source={require('../../../assets/images/auth/Loginscreen.png')}
          className="w-full h-full"
          resizeMode="contain"
          accessibilityLabel="Authentication screen illustration"
        />
      </View>

      {/* Auth Form Section */}
      <View className="flex-1 bg-white rounded-t-[30px] pt-8 px-6 -mt-5">
        {authMode === 'login' ? (
          <Login toggleAuth={toggleAuthMode} />
        ) : (
          <Signup toggleAuth={toggleAuthMode} />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const authStyles = StyleSheet.create({
  headerContainer: {
    height: height * 0.27,
  },
});