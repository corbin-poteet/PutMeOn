import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import gameContext from '@/common/hooks/gameContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useTheme from '@/common/hooks/useThemes';

const EndScreen = () => {

  //End game screen, prompts user to return to menu screen after final score is displayed

  const navigation = useNavigation();
  const { themes, selectedTheme } = useTheme(); //Allows dynamic theme color changing
  const { score, setScore, setEarnings, setRound } = useContext(gameContext);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, //can be set to false to disable swipe out of page
      gestureDirection: 'horizontal',
      animation: 'none',

    });
  }, [navigation]);

  function clearGame() { //wipes game stats so player can start again
    setScore(0);
    setEarnings(0);
    setRound(1);
  }

  return (
    <LinearGradient className="justify-center flex-1 items-center" start={{ x: -0.5, y: 0 }} colors={[themes[selectedTheme].topGradient, themes[selectedTheme].bottomGradient]} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View className='justify-center items-center flex-1 p-10'>
        <Text style={{ color: themes[selectedTheme].text }} className='font-bold text-3xl absolute top-16'>Game Over {"\n\n"}Final score: {score}</Text>
        <TouchableOpacity className="flex-row items-center justify-center px-5 rounded-3xl" style={{ backgroundColor: themes[selectedTheme].button }}
          onPress={() => { clearGame(); navigation.navigate("Start"); }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Return Home</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

export default EndScreen