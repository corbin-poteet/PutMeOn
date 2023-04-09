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
          gestureEnabled: false, //this page bricks the app, locking the user on the screen until the end of time so they may devolve into madness
          gestureDirection: 'horizontal',
        });
      }, [navigation]);

    return (
      <View className='flex-1 justify-center'>
                <View>
                    <Image source={require('@assets/secret.png')} style={{
                        resizeMode: 'contain',
                    }}/>
                </View>
            </View>
    );
}
  

export default SecretScreen