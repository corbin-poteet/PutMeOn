import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '@screens/HomeScreen';
import LoginScreen from '@screens/LoginScreen';
import useAuth from '@hooks/useAuth';
import UserScreen from '@screens/UserScreen';
import AdvertiserScreen from '@/screens/AdvertiserScreen';
import ArtistFormScreen from '@/screens/ArtistFormScreen';
import BusinessFormScreen from '@/screens/BusinessFormScreen';
import PlaylistScreen from '@/screens/PlaylistScreen';
import UserDetails from '@/screens/UserDetails';
import AppInfo from '@/screens/InfoScreen';
import GameScreen from '@/screens/GameScreen';
import { FinishScreen, TutorialScreen, WelcomeScreen } from '@/screens/DemoScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const Tab = () => { //Any screens that show the bottom navbar should be located here, not in the stack navigator
  return (
    <Tabs.Navigator screenOptions={{headerShown: false}}>
      {/* <Tabs.Screen name="Game" component={GameScreen} /> */}
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="User" component={UserScreen} />
    </Tabs.Navigator>
  )
}

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
              <Stack.Screen name="Tabs" component={Tab} />
              <Stack.Screen name="Playlist" component={PlaylistScreen} />
              <Stack.Screen name="UserInfo" component={UserDetails} />
              <Stack.Screen name="AppInfo" component={AppInfo} />
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Tutorial" component={TutorialScreen} />
              <Stack.Screen name="Finish" component={FinishScreen} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
            <Stack.Screen name="Advertiser" component={AdvertiserScreen} />
            <Stack.Screen name="ArtistForm" component={ArtistFormScreen} />
            <Stack.Screen name="BusinessForm" component={BusinessFormScreen} />          
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator