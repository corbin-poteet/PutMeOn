import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const SettingsScreen = () => {

  const navigation = useNavigation();
  const { user, logout } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Settings',
      //TODO: Figure out how to make this swipe from the left

    });
  }, [navigation]);

  return (
    //Logout button functionality, user details
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View style={{ alignItems: 'left' }}>
        <TouchableOpacity onPress={
          () => {
            // @ts-ignore
            navigation.navigate('UserInfo')
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
            <Ionicons style={{ marginRight: 12, marginLeft: 10, }} name="person-circle-outline" size={30} color="white" />
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white' }}>Account</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={
          () => {
            // @ts-ignore
            navigation.navigate('Decks')
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <MaterialIcons style={{ marginRight: 12, marginLeft: 10 }} name="playlist-add-check" size={35} color="white" />
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Decks & Playlists</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="brush-outline" size={35} color="white" />
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Themes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="brush-outline" size={35} color="white" />
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Themes</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="play-circle" size={35} color="white" />
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Playback</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={
          () => {
            // @ts-ignore
            navigation.navigate('AppInfo')
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
            <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="information-circle-outline" size={35} color="white" />
            <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Information</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )


}

export default SettingsScreen