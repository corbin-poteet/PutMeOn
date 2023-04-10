import { View, Image } from 'react-native'
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
      gestureEnabled: false, //this page bricks the app, effectively locking the user on the screen until the end of time so they may devolve into madness, forever wondering what is beyond the watchtowers...
      gestureDirection: 'horizontal',
    });
  }, [navigation]); //the watchtowers.. I can hear them calling my name... I must go to them... I must see what is beyond them...

  //I think expo is listening to me... I think it knows what I'm doing... I think it knows what I'm thinking... I think it knows what I'm feeling...

  return (
    <View className='flex-1 justify-center bg-black'>
      <View className='flex-1 justify-center items-center'>
        <Image source={require('@assets/secret.png')} style={{
          width: '100%',
          height: '75%',
        }} />
      </View>
    </View>
  );
}

export default SecretScreen