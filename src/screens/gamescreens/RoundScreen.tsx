import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';

const RoundScreen = () => {
    
    const navigation = useNavigation();
    
    setTimeout( () => {
      navigation.navigate('Game');
    }, 5000 );

    return (
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View className='flex-1 justify-center'>
          <Text className='text-white text-6xl text-center px-1 font-bold'>Round 1{/*Round Variable*/}</Text>
        </View>
      </LinearGradient>
    );
}
  
export default RoundScreen