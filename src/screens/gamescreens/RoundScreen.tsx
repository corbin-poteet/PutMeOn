import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import gameContext from '@/common/hooks/gameContext';

//Screen used to pad out each game round and announce current round in game

const RoundScreen = () => {
    
    const navigation = useNavigation();
    const { round } = useContext(gameContext); //Maintain round number throughout rounds using context

    React.useLayoutEffect(() => {
      navigation.setOptions({
        gestureEnabled: false, //can be set to false to disable swipe out of page
        gestureDirection: 'horizontal',
        animation: 'none',
      });
    }, [navigation]);
    
    setTimeout( () => {
      navigation.navigate('Game'); //Navigate to the game screen after holding on the round screen for 2 seconds
    }, 2000 );

    return (
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View className='flex-1 justify-center'>
          <Text className='text-white text-6xl text-center px-1 font-bold'>Round {round}</Text>
        </View>
      </LinearGradient>
    );
}
  
export default RoundScreen