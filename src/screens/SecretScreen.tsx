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
      <View className="flex-1 justify-center">
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }} className='flex-1 justify-center items-center'>
          <View style={{ padding: 10 }}>
            <Text className='top-14 text-center text-white'>MULTIPLE DECKS MULTIPLE DECKS MULTIPLE DECKS</Text>
          </View>
        </LinearGradient>
      </View>
    );
}
  

export default SecretScreen