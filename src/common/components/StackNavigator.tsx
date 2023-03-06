import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '@screens/HomeScreen';
import LoginScreen from '@screens/LoginScreen';
import useAuth from '@hooks/useAuth';
import UserScreen from '@screens/UserScreen';
import AdvertiserScreen from '@/screens/AdvertiserScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

  const { token } = useAuth();
  //DUETO
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={
          {
            headerShown: false,
          }
        }>
          {token ? (
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="User" component={UserScreen} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
            <Stack.Screen name="Advertiser" component={AdvertiserScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator