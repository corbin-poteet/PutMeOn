import { TextInput, View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import useAuth from '@hooks/useAuth';

const CreatePlaylistScreen = () => {

  const navigation = useNavigation();

  const { spotify, user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const inputObject = {
    "name": name,
    "description": description,
    "public": false
    }

  async function createPlaylist() {
    await spotify.createPlaylist(user?.id, inputObject).then((response) => {
      Alert.alert("Playlist Created!");
      navigation.navigate("Home");
    });
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">Create New Playlist:</Text>
        <TextInput placeholder='Playlist Name' onChangeText={setName} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl top-5 px-8 py-3'></TextInput>
        <TextInput placeholder='Playlist Description' onChangeText={setDescription} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl top-10 px-8 py-3'></TextInput>
      
        <TouchableOpacity className='absolute bottom-10 flex-row items-center justify-center bg-green-500 rounded-3xl bottom-12 px-8 py-3' 
          onPress={() => {
            Alert.alert("lmao");
            {createPlaylist()};
          }}>
          <Text className='font-semibold text-1 text-white text-xl'>Submit</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default CreatePlaylistScreen