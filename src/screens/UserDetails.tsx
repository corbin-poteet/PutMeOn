import { View, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';


const UserDetails = () => { //Display User information

  const navigation = useNavigation();
  const { user, logout } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'User Information',
    });
  }, [navigation]);

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View className='justify-center py-2'>
        <Text className = 'p-2 font-bold' style={{ fontSize: 28, color: 'white' }}>Account Name: <Text className='font-normal'>{user?.display_name}</Text></Text>
        <Text className = 'p-2 font-bold' style={{ fontSize: 28, color: 'white' }}>Country: <Text className='font-normal'>{user?.country}</Text></Text>
        <Text className = 'p-2 font-bold' style={{ fontSize: 28, color: 'white' }}>Email: <Text className='font-normal'>{user?.email}</Text></Text>
        <Text className = 'p-2 font-bold' style={{ fontSize: 28, color: 'white' }}>Subscription Type: <Text className='font-normal'>{(user?.product)=='premium'?'Premium' : 'Free'}</Text></Text>
      </View>
      <View className='flex-1 justify-center items-center'>
        <TouchableOpacity className='flex-row bg-red-500 px-2 m-2 rounded-3xl absolute bottom-20' onPress={logout}>
          <Text className='text-white text-xl px-8 py-2 font-bold'>Logout</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}


export default UserDetails