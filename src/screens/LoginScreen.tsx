import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
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
        <Image source={require('@assets/Logo_512_White.png')} style={{
          width: 256,
          height: 256,
          transform: [{ translateX: -6 }],
          resizeMode: 'contain',
        }}
          className="mb-12"
        />
        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-5 rounded-3xl" onPress={signInWithSpotify}>
          <FontAwesome className='p-5' name="spotify" size={24} color="white" />
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Sign in with Spotify</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-5 rounded-3xl top-8" onPress={ () => {navigation.navigate("Advertiser")}}>
          <Text className="text-white text-xl py-2 text-1 font-semibold">Artist/Advertiser? Press here.</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default LoginScreen