import { TextInput, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
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

const SearchScreen = () => {

    const { spotify, user } = useAuth();
    const navigation = useNavigation();

    const result: any[] = []; //holds search results in getSearchResults function

    const [toggle, setToggle] = useState<boolean>(false); //false for genre search, true for artist search
    const [search, setSearch] = useState<string>(''); //keeps track of text entered in search bar dynamically
    const [loaded, setLoaded] = useState<boolean>(false); //keeps track of if a screen is done loading
    const [componentHandler, setComponentHandler] = useState<any>(); //keeps track of search results
    const [seeds, setSeeds] = useState<any>([]); //holds up to 5 seeds to pass to next screen

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false
        })
    }, [navigation])

    useEffect(() => { //useEffect to change search results based on toggler state
        if (toggle === true) {
            //code for displaying artists from spotify
        } else if (toggle === false) {
            //code for displaying genres from spotify
        }
    }, [toggle]);

    useEffect(() => { //useEffect to navigate to next page once user is done selecting seeds
      if(seeds.length == 5){
        //@ts-ignore
        navigation.navigate('DeckScreen')
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
                          "index": i
                        }
                      );
                    }
                    
                    const listItems = result.map(
                      (element) => {
                        return (
                          <View>
                            <TouchableOpacity onPress={
                              () => {
                                setSeeds(seeds.push(element.id));
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
                  });
        }
        else{ //if toggle false: search for tracks

        }
        setLoaded(true); //when searching is finished, set loaded true
      }

    return (
        <View className='flex-1 justify-center'>
            <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
                <View className='absolute top-11'>
                    <SearchSwitch text = {toggle.toString()} value = {false} onValueChange={setToggle}/>
                </View>
                <View className='absolute top-20'>
                    <Text className="text-white text-xl px-5 py-2 text-1 font-semibold text-center">This is the search screen. It looks like shit right now but it will allow you to search for 5 seed artists/genres for making a new deck</Text>
                    <TextInput placeholderTextColor={"#0B0B45"} placeholder='Search' onChangeText={setSearch} className='mx-5 font-semibold text-1 text-white text-xl flex-row items-center justify-center rounded-3xl top-5 px-8 py-2.5' style={{ backgroundColor: '#014871' }}></TextInput>
                </View>
                {!loaded //Render Loading Effect, come back to center perfectly later. DOESN'T WORK PROPERLY YET...
                ?
                <View style={{ flex: 1, marginTop: 300 }}>
                  <ActivityIndicator size="large" color="#014871" />
                </View>
                :
                <ScrollView>
                  {componentHandler}
                </ScrollView>
                }
            </LinearGradient>
        </View>
    )
}

export default SearchScreen