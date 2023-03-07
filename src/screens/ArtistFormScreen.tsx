import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';

const ArtistFormScreen = () => {
    
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  return (
    <View className='flex-1 justify-center'>
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <Text className="text-white text-xl px-5 py-2 text-1 font-semibold">Under Construction: Artist Form</Text>
        </LinearGradient>
    </View>
  )
}

export default ArtistFormScreen