import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import useAuth, { AuthProvider } from './hooks/useAuth';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

  const { token } = useAuth();

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
              <Stack.Screen name="Chat" component={ChatScreen} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator