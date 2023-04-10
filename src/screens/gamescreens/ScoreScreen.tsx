import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import gameContext from '@/common/hooks/gameContext';

const ScoreScreen = () => {
    
    const navigation = useNavigation();
    const { round, setRound, score, earnings } = useContext(gameContext);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        gestureEnabled: false, //will be set to false to disable swipe out of page
        gestureDirection: 'horizontal',
      });
    }, [navigation]);

    React.useEffect(() => {
      setRound(round + 1);
    }, []);

    if(round <= 5) { //if game not over, render this component
      return(
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View className='flex-1 justify-center'>
          <Text className='text-white text-6xl text-center px-1 font-bold'>Turn finished!</Text>{/*will say if correct or not later*/}
          <Text className='text-white text-2xl text-center px-2 font-bold'>You earned {earnings} points that round!</Text>
          <Text className='text-white text-2xl text-center px-2 font-bold'>Total Score: {score}</Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
            onPress={() => { navigation.navigate('Round') }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks</Text>
        </TouchableOpacity>
        </View>
        </LinearGradient>
      );
    }

    else{ //triggers if game is over, sends to end page
      //DUETO: update database leaderboard with score here
      return (
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View className='flex-1 justify-center'>
          <Text className='text-white text-6xl text-center px-1 font-bold'>Game Over!</Text>
          <Text className='text-white text-2xl text-center px-2 font-bold'>You earned {earnings} points that round!</Text>
          <Text className='text-white text-2xl text-center px-2 font-bold'>Final Score: {score}</Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-red-500 px-2 m-2 rounded-3xl"
            onPress={() => { navigation.navigate('End') }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Navigate to end page</Text>
        </TouchableOpacity>
        </View>
        </LinearGradient>
      );
    }
}
  
export default ScoreScreen