import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import useGameContext from '@/common/hooks/gameContext';

const EndScreen = () => {
    
    const navigation = useNavigation();
    const { round } = useGameContext();

    if(round > 5) {
      return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={{ padding: 10 }}>
            <Text className='font-white absolute top-10'>This is the End Screen.</Text>
          </View>
        </LinearGradient>
        );
    } else {
      return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
          <View style={{ padding: 10 }}>
            <Text className='font-white absolute top-10'>This is the End Screen.</Text>
          </View>
        </LinearGradient>
        );
    }
    
}
  
export default EndScreen