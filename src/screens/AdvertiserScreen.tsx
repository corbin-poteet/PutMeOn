import { View, Text, Button, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
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
            <TouchableOpacity onPress={ () => {navigation.navigate("Home")}}>
                <Text>Sample text</Text>
            </TouchableOpacity>
        </LinearGradient>
    </View>
  )
}

export default AdvertiserScreen