import { TextInput, View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { push, ref, child, update } from 'firebase/database';
import * as Haptics from 'expo-haptics';
//@ts-ignore
import database from "../../firebaseConfig.tsx";

const appendPromotion = (artist:string, track:string) => { //function to append data to DB
  const updates = { //New JSON object to send to DB
    newArtistSample:{
      artistName : artist,
      trackURL : track
    }
  };
  const newArtistKey = push(child(ref(database), 'ArtistPromos/SampleArtist/')).key; //Generate new key for posting location in DB

  Alert.alert("Successfully submitted data to DB");

  return update(ref(database), updates) //push updates object to DB
}

const ArtistFormScreen = () => {
    
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState<string>('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  
  return (
    <View className='flex-1 justify-center'>
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
          <View className='flex-col items-center absolute top-10'>
            <Text className=" text-white text-xl px-5 py-2 text-1 font-semibold text-center">Welcome to the artist portal! Search for the song you want promoted and press to enter.</Text>
            <TextInput placeholderTextColor={"#0B0B45"} placeholder='Search' onChangeText={setSearchTerm} className='mt-5 font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl px-8 py-3'></TextInput>
          </View>
        </LinearGradient>
    </View>
  )
}

export default ArtistFormScreen