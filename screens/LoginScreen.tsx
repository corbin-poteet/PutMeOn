import { View, Text, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import { ResponseType, useAuthRequest } from "expo-auth-session";
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const LoginScreen = () => {

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);



  const { token, signInWithSpotify } = useAuth();


  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <Text className="text-white text-4xl font-bold py-10">Put Me On</Text>
        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-5 rounded-3xl" onPress={signInWithSpotify}>
          <FontAwesome className='p-5' name="spotify" size={24} color="white" />
          <Text className="text-white text-l px-5 py-2 text-1 font-semibold">Sign in with Spotify</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default LoginScreen