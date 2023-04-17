import { TextInput, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '@hooks/useAuth';
import { push, ref, set, child, get } from 'firebase/database';
import { output } from './SearchScreen.js';
// @ts-ignore
import database from "../../firebaseConfig.tsx";

var playlists: any[];
var createdPlaylist: any;

const CreatePlaylistScreen = () => {

  const navigation = useNavigation();

  const { spotify, user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loaded, setLoaded] = useState<boolean>(false);
  
    const inputObject = {
      "name": name,
      "description": description,
      "public": false
      }
  
    React.useEffect(() => {
      if(loaded == true) {
        console.log("PLAYLIST: "+createdPlaylist?.id);

        set(ref(database, "Decks/" + user?.id +"/"+ createdPlaylist?.id), {
          playlistId: createdPlaylist?.id,
          playlistName: createdPlaylist?.name
        });
      }
    }, [loaded]);

  async function getPlaylists() {
    const response = await spotify.getUserPlaylists(user?.id, { limit: 50 }
    ).then(
      function (data) {
        playlists = data.items;
        createdPlaylist = playlists[0]; //Because our newest playlist will, without a doubt, be our first one in the array.
      });
      setLoaded(true);
  }

  async function createPlaylist() {
    await spotify.createPlaylist(user?.id, inputObject).then((response) => {
      Alert.alert("Playlist Created!");
      getPlaylists();
      //navigation.navigate('Home');
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
        <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">Creating a new Deck creates a playlist in Spotify. Let's give it a name!</Text>
        <TextInput placeholder='Playlist Name' onChangeText={setName} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl top-5 px-8 py-3' style={{ backgroundColor: '#014871' }}></TextInput>
        <TextInput placeholder='Playlist Description' onChangeText={setDescription} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl top-10 px-8 py-3' style={{ backgroundColor: '#014871' }}></TextInput>
      
        <TouchableOpacity className='absolute bottom-10 flex-row items-center justify-center rounded-3xl bottom-12 px-8 py-3' style={{ backgroundColor: '#014871' }}
          onPress={() => {
            {createPlaylist()};
          }}>
          <Text className='font-semibold text-1 text-white text-xl'>Create Playlist</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default CreatePlaylistScreen