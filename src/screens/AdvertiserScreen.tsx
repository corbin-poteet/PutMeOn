import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';

const AdvertiserScreen = () => {
    
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  return (
    <View className='flex-1 justify-center'>
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <Image source={require('@assets/SpotlightLogo_512_White.png')} style={{
              width: 256,
              height: 256,
              transform: [{ translateX: -6 }],
              resizeMode: 'contain',
            }}
              className="DUETO"
            />
            <Text className="text-white text-xl px-10 py-2 text-1 font-semibold bottom-12 text-center">Welcome to PutMeOn Spotlight, our service for artists and businesses alike to promote their music and products. Please select from the options below:</Text>
            <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-10 rounded-3xl margin-4" onPress={ () => {navigation.navigate("ArtistForm")}}>
                <Text className="text-white text-xl px-5 py-2 text-1 font-semibold">Promote Your Music</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-5 rounded-3xl top-4" onPress={ () => {navigation.navigate("BusinessForm")}}>
                <Text className="text-white text-xl px-5 py-2 text-1 font-semibold">Advertise for a Business</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-center bg-red-500 px-14 rounded-3xl top-8" onPress={ () => {navigation.navigate("Login")}}>
                <Text className="text-white text-xl px-5 py-2 text-1 font-semibold">Return to Login</Text>
            </TouchableOpacity>
        </LinearGradient>
    </View>
  )
}

export default AdvertiserScreen