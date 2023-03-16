import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const UserScreen = () => {

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
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-end' }}>
        <View style={{ alignItems: 'left'}}> 
        <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 60, marginBottom: 10}}>
        <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="person-circle-outline" size={30} color="white" />
       <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', marginBottom: 5, marginTop: 5 }}>Account</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
          <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="game-controller" size={35} color="white" />
          <Text style={{fontWeight: 'bold', fontSize: 30, color: 'white', }}>Game Settings</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
          <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="moon" size={35} color="white" />
          <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Dark Mode</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
          <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="play-circle" size={35} color="white" />
          <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Playback</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
          <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="information-circle-outline" size={35} color="white" />
          <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Information</Text>
        </View>
        </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center',flex: 1, justifyContent: 'flex-end' }}> 
          <TouchableOpacity style={{ backgroundColor: 'red', width: '60%', height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 1 }} onPress={logout}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 20, color: 'white' }}>Account Name: {user?.display_name}</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>Country: {user?.country}</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>Email: {user?.email}</Text>
          <Text style={{ fontSize: 20, color: 'white' }}>Subscription Type: {user?.product}</Text>
        </View>
        </LinearGradient>

  )

  
}

export default UserScreen