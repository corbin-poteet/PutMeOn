import { TextInput, View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import SearchSwitch from '@/common/components/SearchSwitch';
import useAuth from '@/common/hooks/useAuth';
import { ScrollView } from 'react-native-gesture-handler';


var searchResults: any[];
var output: any[] = [];

//Search bar screen for selecting seeds

const SearchScreen = () => {

  const { spotify, user } = useAuth();
  const navigation = useNavigation();

  const result: any[] = []; //holds search results in getSearchResults function

  const [toggle, setToggle] = useState<boolean>(false); //false for genre search, true for artist search
  const [search, setSearch] = useState<string>(''); //keeps track of text entered in search bar dynamically
  const [loaded, setLoaded] = useState<boolean>(false); //keeps track of if a screen is done loading
  const [seeds, setSeeds] = useState<any[]>([]); //holds up to 5 seeds to pass to next screen
  const [componentHandler, setComponentHandler] = useState<any>([]); //keeps track of search results

  useLayoutEffect(() => { //hide header
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: true, //will be set to false later (you can't back out of this screen)
      gestureDirection: 'horizontal'
    })
  }, [navigation])

  useEffect(() => { //useEffect to search every time the user types in the search bar, but only if user's credentials are valid
    if (user != undefined && user.id != undefined) {
      getSearchResults();
    }
  }, [user, search]);

  function handleSubmit(){
    if(seeds.length > 0){ //if seeds are selected, navigate to next screen
      Alert.alert("Seeds selected! Time to create a playlist for the deck");
      output = seeds;
      //@ts-ignore
      navigation.navigate('CreatePlaylist');
    }
    else{
      Alert.alert("Please select at least one seed.");
    }
  }

  async function getSearchResults() {
    setLoaded(false); //when actively searching, set loaded false
    if (toggle) { //if toggle true: search for artists
      const response = await spotify.searchArtists(search, { limit: 20 }).then(
        function (data) {
          searchResults = data.artists.items;

          for (let i = 0; i < searchResults.length; i++) {
            result.push(
              {
                "name": searchResults[i].name,
                "image": searchResults[i].images[0],
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
                      setSeeds([...seeds, element.id]);
                      Alert.alert("Added artist: " + element.name);
                      console.log("ADDING ARTIST: " + element.name);
                      console.log(seeds);
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
    }
    else { //if toggle false: search for tracks
      const response = await spotify.searchTracks(search, { limit: 20 }).then(
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
                      setSeeds([...seeds, element.id]);
                      Alert.alert("Added song: " + element.name);
                      console.log("ADDING SONG: " + element.name);
                      console.log(seeds);
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
    }
    setLoaded(true); //when searching is finished, set loaded true
  }


  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        {/* Search Bar / Header */}
        <View className='items-center justify-center' style={{ marginTop: 50, flex: 1 }}>
          <View className='absolute top-4'>
            <SearchSwitch text={toggle.toString()} value={false} onValueChange={setToggle} />
          </View>
          <View className='absolute top-20'>
            <Text className="text-white text-2xl px-5 py-2 text-1 font-semibold text-center">Search for up to 5 artists and songs. Put Me On will fill your deck with recommendations:</Text>
            <TextInput placeholderTextColor={"#0B0B45"} placeholder='Search' onChangeText={setSearch} className='mx-5 font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl top-5 px-8 py-2.5' style={{ backgroundColor: '#014871' }}></TextInput>
          </View>

          {/* Search Results */}
          <View className='py-2' style={{ marginTop: 280, marginBottom: 100, flex: 1 }}>
            {!loaded
              ?
              <View style={{ flex: 1, marginTop: 300 }}>
                <ActivityIndicator size="large" color="#014871" />
              </View>
              :
              <ScrollView style={{ flex: 1 }}>
                {componentHandler}
              </ScrollView>
            }
            <View className='mt-12 flex-row justify-center items-center'>
              <TouchableOpacity className='mx-3 rounded-3xl px-8 py-3' style={{ backgroundColor: '#014871' }} onPress={() => { handleSubmit(); }}>
                <Text className='font-semibold text-white'>Done</Text>
              </TouchableOpacity>
              <TouchableOpacity className='mx-3 rounded-3xl px-8 py-3' style={{ backgroundColor: '#014871' }} onPress={() => {}}>
                <Text className='font-semibold text-1xl text-white'>Seeds</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}
export { output, };
export default SearchScreen