import { TextInput, View, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import useAuth from '@/common/hooks/useAuth';
import { ScrollView } from 'react-native-gesture-handler';

//👌😂👌 🔥 🔥 🔥

var searchResults: any[];

//Search bar screen for selecting seeds

const ArtistFormScreen = () => {

  const { spotify, user } = useAuth();
  const navigation = useNavigation();

  const result: any[] = []; //holds search results in getSearchResults function

  const [search, setSearch] = useState<string>(''); //keeps track of text entered in search bar dynamically
  const [loaded, setLoaded] = useState<boolean>(false); //keeps track of if a screen is done loading
  const [seeds, setSeeds] = useState<any[]>([]); //holds up to 5 seeds to pass to next screen
  
  const [trackSeeds, setTrackSeeds] = useState<string[]>([]); //holds up to 5 track seeds to pass to next screen
  const [artistSeeds, setArtistSeeds] = useState<string[]>([]); //holds up to 5 artist seeds to pass to next screen
  
  const [readableSeeds, setReadableSeeds] = useState<string[]>([]); //holds the human-readable names of the seeds to display to user
  const [componentHandler, setComponentHandler] = useState<any>([]); //component handler for showing search results

  useLayoutEffect(() => { //hide header
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: true, //will be set to false later (you can't back out of this screen)
      gestureDirection: 'horizontal'
    })
  }, [navigation])

  useEffect(() => { //useEffect to clear search results when input goes back to empty
    if (search == '') {
      setComponentHandler([]);
    }
  }, [search]);

  useEffect(() => { //useEffect to search every time the user types in the search bar, but only if user's credentials are valid
    if (user != undefined && user.id != undefined) {
      getSearchResults();
    }
  }, [user, search]);

  async function getSearchResults() {
    setLoaded(false); //when actively searching, set loaded false
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
                      //DUETO: add DB call to add element.id to artist promotions here
                      Alert.alert("Song selected!");
                      //@ts-ignore
                      navigation.navigate("Advertiser");
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
            {/*Header / Search bar*/}
            <Text className=" text-white text-xl px-5 py-2 text-1 font-semibold text-center">Welcome to the artist portal! Search for the song you want promoted and press to enter.</Text>
            <TextInput style={{ width: "90%", backgroundColor: '#014871' }} placeholderTextColor={"#0B0B45"} placeholder='Search' onChangeText={setSearch} className='mt-5 font-semibold text-1 text-white text-xl flex-row items-center justify-center bg-green-500 rounded-2xl px-8 py-3'></TextInput>
            
            {/*Search Results*/}
            {!loaded
            ?
            <ActivityIndicator className='mt-60' size='large' color='#0B0B45' />
            :
            <ScrollView className='mt-5 flex-1'>
              {componentHandler}
            </ScrollView>
            }
          </View>
        </LinearGradient>
    </View>
  )
  
}
export default ArtistFormScreen


//FOR CERTIFIED HOOD CLASSIC USE ONLY


// return (
//   <View className='flex-1 justify-center'>
//     <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
//         <View className='items-center justify-center flex-col absolute top-20 mt-5'>
//         {/*Header / Search bar*/}
//         <View className='mt-10'>
//           <Text className="text-white text-2xl mx-2 font-semibold text-center">Welcome to the artist portal! Search for the song you want promoted and press to enter.</Text>
//           <TextInput placeholderTextColor={"#0B0B45"} placeholder='Search' onChangeText={setSearch} className='mx-5 font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl mt-5 px-8 py-2.5' style={{ backgroundColor: '#014871' }}></TextInput>
//         </View>

//         {/*Search Results*/}
//         <View className='mt-5'>
//           {!loaded
//             ?
//             <View style={{ flex: 1, marginTop: 300 }}>
//               <ActivityIndicator size="large" color="#014871" />
//             </View>
//             :
//             <ScrollView style={{ flex: 1 }}>
//               {componentHandler}
//             </ScrollView>
//           }
//         </View>
//       </View>
//     </LinearGradient>
//   </View>
// )