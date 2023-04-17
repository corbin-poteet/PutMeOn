import React from 'react'
import * as Haptics from 'expo-haptics';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAuth from '@hooks/useAuth';
import HomeScreen from '@screens/HomeScreen';
import DeckScreen from '@screens/DeckScreen';
import LoginScreen from '@screens/LoginScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import AdvertiserScreen from '@/screens/AdvertiserScreen';
import ArtistFormScreen from '@/screens/ArtistFormScreen';
import BusinessFormScreen from '@/screens/BusinessFormScreen';
import PlaylistScreen from '@/screens/PlaylistScreen';
import UserDetails from '@/screens/UserDetails';
import AppInfo from '@/screens/InfoScreen';
import CreatePlaylistScreen from '@/screens/CreatePlaylistScreen';
import SecretScreen from '@/screens/SecretScreen';
import GameScreen from '@/screens/gamescreens/GameScreen';
import ScoreScreen from '@/screens/gamescreens/ScoreScreen';
import RoundScreen from '@/screens/gamescreens/RoundScreen';
import EndScreen from '@/screens/gamescreens/EndScreen';
import StartScreen from '@/screens/gamescreens/StartScreen';
import SearchScreen from '@/screens/SearchScreen';
import ThemesScreen from '@screens/ThemesScreen';

import { FinishScreen, TutorialScreen, WelcomeScreen } from '@/screens/DemoScreen';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const Tab = () => { //Any screens that show the bottom navbar should be located here, not in the stack navigator
  return (
    <Tabs.Navigator initialRouteName = "Home" screenOptions={{headerShown: false}}>
      <Tabs.Screen name="Start" component={StartScreen} listeners={
        {tabPress: () => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
      }
      options={{
        tabBarLabel: 'Game',
        tabBarIcon: () => 
          <FontAwesome name="gamepad" size={24} color="deepskyblue" />
      }}
      />
      <Tabs.Screen name="Home" component={HomeScreen} listeners={
        {tabPress: () => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
      }
      options={{
        tabBarLabel: 'Swipe',
        tabBarIcon: () =>
          <MaterialCommunityIcons name="cards" size={24} color="deepskyblue" />
      }}
      />
      <Tabs.Screen name="Settings" component={SettingsScreen} listeners={
        {tabPress: () => {Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}}
      }
      options={{
        tabBarLabel: 'Settings',
        tabBarIcon: () =>
          <FontAwesome name="cog" size={24} color="deepskyblue" />
      }}
      />
    </Tabs.Navigator>
  )
}



const StackNavigator = () => {

  const { user } = useAuth();

  //DUETO
  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={
          {
            headerShown: false,
          }
        }>
          {user != undefined ? (
            <>
              <Stack.Screen name="Navbar" component={Tab} />
              <Stack.Screen name="Decks" component={DeckScreen} />
              <Stack.Screen name="Playlist" component={PlaylistScreen} />
              <Stack.Screen name="CreatePlaylist" component={CreatePlaylistScreen} />
              <Stack.Screen name="UserInfo" component={UserDetails} />
              <Stack.Screen name="AppInfo" component={AppInfo} />
              <Stack.Screen name="Secret" component={SecretScreen} />
              <Stack.Screen name="Search" component={SearchScreen} />
              <Stack.Screen name="Themes" component={ThemesScreen} />


              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Tutorial" component={TutorialScreen} />
              <Stack.Screen name="Finish" component={FinishScreen} />

              <Stack.Screen name="Score" component={ScoreScreen} />
              <Stack.Screen name="Round" component={RoundScreen} />
              <Stack.Screen name="End" component={EndScreen} />
              <Stack.Screen name="Game" component={GameScreen} />
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