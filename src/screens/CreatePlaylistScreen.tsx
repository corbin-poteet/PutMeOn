import { TextInput, View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const CreatePlaylistScreen = () => {
    
  const navigation = useNavigation();
  const [artistName, setArtistName] = useState('');
  const [trackName, setTrackName] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  return (
    <View className='flex-1 justify-center'>
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
            <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">Welcome to the TME: Take me everywhere</Text>
            <TextInput placeholder='Enter Artist Name' onChangeText={setArtistName} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl top-5 px-8 py-3'></TextInput>
            <TextInput placeholder='Enter Track Name' onChangeText={setTrackName} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl top-10 px-8 py-3'></TextInput>

            <TouchableOpacity className='flex-row items-center justify-center bg-green-500 rounded-3xl bottom-12 px-8 py-3' onPress={ () => 
              {
                Alert.alert("lmao");
              }}>
              <Text className='font-semibold text-1 text-white text-xl'>Submit</Text></TouchableOpacity>
        </LinearGradient>
    </View>
  )
}

export default CreatePlaylistScreen