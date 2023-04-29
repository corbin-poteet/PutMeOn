import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import gameContext from '@/common/hooks/gameContext';
import useTheme from '@/common/hooks/useThemes';

//Display score after each game round

const ScoreScreen = () => {
    
    const navigation = useNavigation();
    const { themes, selectedTheme } = useTheme(); //Allows dynamic theme color changing
    const { round, setRound, score, earnings } = useContext(gameContext);

    React.useLayoutEffect(() => {
      navigation.setOptions({
        gestureEnabled: false, //will be set to false to disable swipe out of page
        gestureDirection: 'horizontal',
        animation: 'none',
      });
    }, [navigation]);

    React.useEffect(() => {
      // @ts-ignore
      setRound(round + 1);
    }, []);

    if(round <= 5) { //if game not over, render this component
      return(
        // @ts-ignore
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={[themes[selectedTheme].topGradient, themes[selectedTheme].bottomGradient]} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View className='flex-1 justify-center'>
          {/*@ts-ignore*/}
          <Text style = {{color: themes[selectedTheme].text}} className='text-6xl text-center px-1 font-bold'>{(earnings>0)?'Correct!':'Incorrect!'}</Text>
          {/*@ts-ignore*/}
          <Text style = {{color: themes[selectedTheme].text}} className='text-2xl text-center px-2 font-bold'>You earned {earnings} points that round!</Text>
          {/*@ts-ignore*/}
          <Text style = {{color: themes[selectedTheme].text}} className='text-2xl text-center px-2 font-bold'>Total Score: {score}</Text>
          {/*@ts-ignore*/}
          <TouchableOpacity className="flex-row items-center justify-center px-2 m-2 rounded-3xl" style={{ backgroundColor: themes[selectedTheme].button }}
            // @ts-ignore
            onPress={() => { navigation.navigate('Round') }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Next Round</Text>
        </TouchableOpacity>
        </View>
        </LinearGradient>
      );
    }

    else{ //triggers if game is over, sends to end page
      //DUETO: update database leaderboard with score here
      return (
        // @ts-ignore
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={[themes[selectedTheme].topGradient, themes[selectedTheme].bottomGradient]} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View className='flex-1 justify-center'>
          {/*@ts-ignore*/}
          <Text style={{ color: themes[selectedTheme].text }} className='text-6xl text-center px-1 font-bold'>{(earnings>0)?'Correct!':'Incorrect!'}</Text>
          {/*@ts-ignore*/}
          <Text style={{ color: themes[selectedTheme].text }} className='text-2xl text-center px-2 font-bold'>You earned {earnings} points that round!</Text>
          {/*@ts-ignore*/}
          <Text style={{ color: themes[selectedTheme].text }} className='text-2xl text-center px-2 font-bold'>Final Score: {score}</Text>
          <TouchableOpacity className="flex-row items-center justify-center bg-red-500 px-2 m-2 rounded-3xl"
            // @ts-ignore
            onPress={() => { navigation.navigate('End') }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Finish Game</Text>
        </TouchableOpacity>
        </View>
        </LinearGradient>
      );
    }
}
  
export default ScoreScreen