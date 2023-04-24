import { TextInput, View, Text, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { push, ref, child, update } from 'firebase/database';
import * as Haptics from 'expo-haptics';
//@ts-ignore
import database from "../../firebaseConfig.tsx";
import useAuth from '@/common/hooks/useAuth';

const appendPromotion = (trackID:string) => { //function to append data to DB

}

const ArtistFormScreen = () => {
    
  const navigation = useNavigation();
  const { spotify, user} = useAuth();

  const [searchTerm, setSearchTerm] = useState<string>(''); //keeps track of text entered in search bar dynamically
  const [componentHandler, setComponentHandler] = useState<any>([]); //component handler for showing search results
  const [loaded, setLoaded] = useState<boolean>(false); //keeps track of if a screen is done loading

  let searchResults: any[] = [];

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => { //useEffect to search every time the user types in the search bar, but only if user's credentials are valid
    if (user != undefined && user.id != undefined) {
      getSearchResults();
    }
  }, [user, searchTerm]);

  async function getSearchResults() {
    console.log("SEARCHING");
    setLoaded(false); //when actively searching, set loaded false
    const result: any[] = []; //holds search results in getSearchResults function

    const response = await spotify.searchTracks(searchTerm, { limit: 20 }).then(
      function (data) {
        searchResults = data.tracks.items;

        for (let i = 0; i < searchResults.length; i++) {
          result.push(
            {
              "name": searchResults[i].name,
              "image": searchResults[i].album.images[0],
              "id": searchResults[i].id
            }
          );
        }

        const listItems = result.map(
          (element) => {
            return (
              <View>
                <TouchableOpacity onPress={
                  () => {
                    //DUETO: push track ID to DB here
                    setComponentHandler([]); //clear search results on screen
                  }
                }>
                  <View className='px-4' style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                    <Image source={element.image != undefined ? { uri: element.image.url } : require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }} />
                    <Text numberOfLines={1} style={{ fontSize: 24, color: 'white' }}>{element.name}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }
        )
        setComponentHandler(listItems);
      })
      .catch(error => {
        // Handle promise rejection
        console.log("SEARCH ERROR: " + error.message);
      });
  setLoaded(true); //when searching is finished, set loaded true
  }
  
  return (
    <View className='flex-1 justify-center'>
        <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
          <View className='flex-col items-center absolute top-10'>
            <Text className=" text-white text-xl px-5 py-2 text-1 font-semibold text-center">Welcome to the artist portal! Search for the song you want promoted and press to enter.</Text>
            <TextInput placeholderTextColor={"#0B0B45"} placeholder='Search' onChangeText={setSearchTerm} className='mt-5 font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-3xl px-8 py-3'></TextInput>
            {!loaded
            ?
            <ActivityIndicator className='mt-60' size='large' color='#0B0B45' />
            :
            <ScrollView className='mt-5 items-center flex-1'>
              {componentHandler}
            </ScrollView>
            }
          </View>
        </LinearGradient>
    </View>
  )
}

export default ArtistFormScreen