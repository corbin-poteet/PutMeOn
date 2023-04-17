import { TextInput, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import SearchSwitch from '@/common/components/SearchSwitch';
import useAuth from '@/common/hooks/useAuth';
import { ref, child, get, set } from 'firebase/database';
import { ScrollView } from 'react-native-gesture-handler';
// @ts-ignore
import database from "../../firebaseConfig.tsx";


let searchResults: any[];

// const ChosenSeeds = (seeds: any, setSeeds: React.Dispatch<any>) => { //component to display a list of seeds the user has pressed, and remove them if user presses them
//   return (
//     <View className='flex-row'>
//       <Text>Chosen Seeds: </Text>
//       <TouchableOpacity onPress={() => {console.log("Will remove chosen seed")}}>
//         <Text>{/*Will display seeds later*/}</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

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

    useEffect(() => { //useEffect to navigate to next page once user is done selecting seeds
      if(seeds?.length == 5){
        //@ts-ignore
        navigation.navigate('Home')
      }
    }, [seeds]);

    useEffect(() => { //useEffect to search every time the user types in the search bar, but only if user's credentials are valid
      if (user != undefined && user.id != undefined) {
        getSearchResults();
      }
    }, [user, search]);


    async function getSearchResults() {
        setLoaded(false); //when actively searching, set loaded false
        if(toggle){ //if toggle true: search for artists
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
                              setComponentHandler([]);
                              }
                            }>
                              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}>{element.name}</Text>
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
        else{ //if toggle false: search for tracks
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
                            setComponentHandler([]);
                          }
                        }>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 24, color: 'white' }}>{element.name}</Text>
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
                <View className='absolute top-11'>
                    <SearchSwitch text = {toggle.toString()} value = {false} onValueChange={setToggle}/>
                </View>
                <View className='absolute top-20'>
                    <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">This is the search screen. It looks like shit right now but allows you to search for 5 seed artists/genres for your deck (true on the toggle makes search work rn)</Text>
                    <TextInput placeholderTextColor={"#0B0B45"} placeholder='Search' onChangeText={setSearch} className='mx-5 font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl top-5 px-8 py-2.5' style={{ backgroundColor: '#014871' }}></TextInput>
                </View>

                {/* Search Results */}
                <View className='absolute top-80'>
                  {/* <ChosenSeeds seeds={seeds} setSeeds={setSeeds}/> */}
                    {!loaded
                    ?
                    <View style={{ flex: 1, marginTop: 300 }}>
                      <ActivityIndicator size="large" color="#014871" />
                    </View>
                    :
                    <ScrollView>
                      {componentHandler}
                    </ScrollView>
                    }
                </View>
            </LinearGradient>
        </View>
    )
}

export default SearchScreen