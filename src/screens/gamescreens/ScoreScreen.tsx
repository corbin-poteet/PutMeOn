import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import useGameContext from '@/common/hooks/gameContext';

const ScoreScreen = () => {
    
    const navigation = useNavigation();
    const { round, score, earnings } = useGameContext();

    React.useLayoutEffect(() => {
      navigation.setOptions({
        gestureEnabled: true, //can be set to false to disable swipe out of page
        gestureDirection: 'horizontal',
      });
    }, [navigation]);

    return (
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View className='flex-1 justify-center'>
          <Text className='text-white text-6xl text-center px-1 font-bold'>Correct!</Text>
          <Text className='text-white text-4xl text-center p-5 font-bold'>Round {round}</Text>
          <Text className='text-white text-2xl text-center px-2 font-bold'>Earned {earnings} points</Text>
          <Text className='text-white text-2xl text-center px-2 font-bold'>Total Score: {score}</Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
            onPress={() => { navigation.navigate('Round') }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks{}</Text>
        </TouchableOpacity>
        </View>
      </LinearGradient>
    );
}
  
export default ScoreScreen