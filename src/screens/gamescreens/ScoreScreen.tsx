import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';

const ScoreScreen = () => {
    
    const navigation = useNavigation();

    return (
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View style={{ padding: 10 }}>
          <Text className='font-white absolute top-10'>This is the Score Screen.</Text>
        </View>
      </LinearGradient>
    );
}
  
export default ScoreScreen