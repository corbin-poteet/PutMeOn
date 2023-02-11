import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/core';

const MenuScreen = () => {
    
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Menu',
      //TODO: Figure out how to make this swipe from the left
      
    });
  }, [navigation]);
  
  return (
    <View className='flex-row justify-center items-center'> 
      <TouchableOpacity className='flex-row items-center justify-center bg-gray-600 px-20 py-15 rounded-3xl absolute top-20'>
        <Text className='text-white text-xl px-5 py-2 text-1 font-semibold'>View Liked Songs</Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-row items-center justify-center bg-gray-600 px-20 py-15 rounded-3xl absolute top-40'>
        <Text className='text-white text-xl px-5 py-2 text-1 font-semibold'>View Disliked Songs</Text>
      </TouchableOpacity>
      <TouchableOpacity className='flex-row items-center justify-center bg-gray-600 px-20 py-15 rounded-3xl absolute top-80'>
        <Text className='text-white text-xl px-5 py-2 text-1 font-semibold'>Settings</Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default MenuScreen