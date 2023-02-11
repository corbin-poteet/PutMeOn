import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

const UserScreen = () => {

  const navigation = useNavigation();
  const { user, logout } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: user?.display_name || 'User',
      //TODO: Figure out how to make this swipe from the left
      
    });
  }, [navigation]);

  return (
    //Logout button functionality, user details
    <View>
      <View className='flex-row justify-center items-center'> 
        <TouchableOpacity className='flex-row items-center justify-center bg-red-500 px-20 py-15 rounded-3xl absolute top-80' onPress={logout}>
          <Text className='text-white text-xl px-5 py-2 text-1 font-semibold'>Logout</Text>
        </TouchableOpacity>
      </View>
      <View className='flex-row justify-center items-center'>
        <Text className='text-xl'>Display Name: {[user.display_name]}</Text>
      </View>
      <View className='flex-row justify-center items-center'>
        <Text className='text-xl'>Country: {user.country}</Text>
      </View>
      <View className='flex-row justify-center items-center'>
        <Text className='text-xl'>Email: {user.email}</Text>
      </View>
      <View className='flex-row justify-center items-center'>
        <Text className='text-xl'>Subscription Type: {user.product}</Text>
      </View>
    </View>
    
  )
}

export default UserScreen