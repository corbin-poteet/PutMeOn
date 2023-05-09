import { TextInput, View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '@hooks/useAuth';
import { ref, set } from 'firebase/database';
//@ts-ignore
import { output } from './SearchScreen.tsx';
// @ts-ignore
import database from "../../firebaseConfig.tsx";
import gameContext from '@/common/hooks/gameContext';
import useDeckManager from '@/common/hooks/useDeckManager';

var playlists: any[];
var createdPlaylist: any;

//Create new playlist based on deck created from deck screen

const CreatePlaylistScreen = () => {

  const navigation = useNavigation();

  const { spotify, user } = useAuth();
  const { selectedPlaylist, setSelectedPlaylist } = useContext(gameContext);

  const { deckManager } = useDeckManager();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const inputObject = {
    "name": name,
    "description": description,
    "public": false
  }

  async function getPlaylists() { //Obtain newly created playlist to push to database
    const response = await spotify.getUserPlaylists(user?.id, { limit: 50 }
    ).then(
      function (data) {
        playlists = data.items;
        createdPlaylist = playlists[0]; //Because our newest playlist will, without a doubt, be our first one in the array.

        console.log("Setting DB in CreatePlaylistScreen")

        set(ref(database, "Decks/" + user?.id + "/" + createdPlaylist?.id), {
          id: createdPlaylist?.id,
          name: createdPlaylist?.name,
          seeds: output
        });

        set(ref(database, "SelectedDecks/" + user?.id), {
          id: createdPlaylist?.id,
          name: createdPlaylist?.name,
          seeds: output
        });
      });
      // @ts-ignore
      setSelectedPlaylist(createdPlaylist?.id); //set spotify playlist context

  }

  async function createPlaylist() { //Build playlist within spotify app
    Alert.alert("Playlist Created!");
    // @ts-ignore
    navigation.navigate('Home');
    // @ts-ignore
    await spotify.createPlaylist(user?.id, inputObject).then((response) => {
      getPlaylists();
    });
    console.log("ERROR CHECK PASSED")

  }

  React.useLayoutEffect(() => { //Removes header on this screen
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">Creating a new Deck creates a playlist in Spotify. Let's give it a name!</Text>
        <TextInput placeholderTextColor={"#0B0B45"} placeholder='Playlist Name' onChangeText={setName} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl top-5 px-8 py-3' style={{ backgroundColor: '#014871' }}></TextInput>
        <TextInput placeholderTextColor={"#0B0B45"} placeholder='Playlist Description' onChangeText={setDescription} className='font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl top-10 px-8 py-3' style={{ backgroundColor: '#014871' }}></TextInput>

        <TouchableOpacity className='absolute bottom-10 flex-row items-center justify-center rounded-3xl bottom-12 px-8 py-3' style={{ backgroundColor: '#014871' }}
          onPress={() => {
            { createPlaylist() };
          }}>
          <Text className='font-semibold text-1 text-white text-xl'>Create Playlist</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )
}

export default CreatePlaylistScreen