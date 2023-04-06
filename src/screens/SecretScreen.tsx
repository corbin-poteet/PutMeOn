import { View, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';


const SecretScreen = () => { //Shhhhhhhh....
    
    const navigation = useNavigation();
    const { user } = useAuth();

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: false,
        });
      }, [navigation]);

    return (
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View style={{ padding: 10 }}>
          <Text className='flex-1 text-center'>MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKSMULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKSMULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKSMULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKSMULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKSMULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKSMULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS</Text>
        </View>
      </LinearGradient>
    );
}
  

export default SecretScreen