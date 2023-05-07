import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react';
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { ref, child, get, set } from 'firebase/database';
import gameContext from '@/common/hooks/gameContext';
// @ts-ignore
import database from "../../firebaseConfig.tsx";
import useDeckManager, { Deck } from '@/common/hooks/useDeckManager';
import DeckManager from '@/common/components/DeckManager';
import useTheme from '@/common/hooks/useThemes';


var playlists: any[];

//let loaded: boolean = false;
//Maybe add these values as props?

//Landing page for creating decks and selecting current working decks

const DeckScreen = () => {

  const { deckManager } = useDeckManager();
  const navigation = useNavigation();
  const dbRef = ref(database);
  const { selectedPlaylist, setSelectedPlaylist } = useContext(gameContext);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  //const [selectedPlaylist, setSelectedPlaylist] = React.useState<any>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [componentHandler, setComponentHandler] = React.useState<any>();
  const [decks, setDecks] = React.useState<string[]>();
  const [deckss, setDeckss] = React.useState<Deck[]>();
  const { themes, selectedTheme } = useTheme(); //Allows dynamic theme color changing

  React.useLayoutEffect(() => {
    if (selectedPlaylist == null) {
      navigation.setOptions({
        //gestureEnabled: false // RE- ENABLE THIS LATER
      });
    }
  }, [navigation]);

  const { spotify, user } = useAuth();

  const result: any[] = [];

  function getDecks() { //Obtain all spotify playlists that are hooked to a deck
    get(child(dbRef, "Decks/" + user?.id)).then((snapshot) => { //When User is obtained, establish database array

      let temp: string[] = [];

      if (snapshot.exists()) { //If playlist ID is within the decks database, render that playlist as a valid deck
        snapshot.forEach((element: any) => {
          var value = element.val();
          temp.push(value?.id); //change to ID
          setDecks(temp); //Push database spotify playlist ids item to decks array (string)
        });
      } else {
        console.log("Failed to retrieve data from database")
      }

    });
  }

  function getImageForDeck(deck: Deck) {
    const seeds = deck.seeds;
    if (seeds.length > 0) {
      return { uri: seeds[0].image };
    }

    return require("@assets/blank_playlist.png");

  }

  async function getPlaylists() { //Obtain all spotify playlists owned by current user

    const deckList = await deckManager.getDecksFromDatabase().then((decks) => {
      setDeckss(decks);

      // list of decks to be rendered
      const deckList = decks.map((deck) => {
        return (
          <View key={deck.id}>
            <TouchableOpacity onPress={() => {
              createAlert(deck);
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                <Image source={getImageForDeck(deck)} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }} />
                {/*@ts-ignore*/}
                <Text style={{ fontWeight: 'bold', fontSize: 24, color: themes[selectedTheme].text }}> {deck.name} </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      });

      return deckList;

    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      setLoaded(true);
    });

    setComponentHandler(deckList);
    setLoaded(true);
  }

  async function createAlert(deck: Deck) { //Confirm playlist selection alert
    Alert.alert('Confirm Deck', 'Select ' + deck.name + ' as your Put Me On Deck?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes', onPress:
          () => {
            const loadDeck = deckManager.setSelectedDeck(deck);
            loadDeck.then(() => {
              // @ts-ignore
              navigation.navigate('Home');
            }).catch((error) => {
              console.log(error);
            });


          }
      }
    ]);
  }

  React.useEffect(() => {
    if (user != undefined && user.id != undefined) { //Load Playlists only after user credentials are retrieved
      getDecks();
    }
  }, [user]);

  React.useEffect(() => {
    //console.log("DECKS CHANGED: "+decks);
    if (decks && decks.length > 0 && user) { //Grab playlists upon decks being loaded from the database
      getPlaylists();
    }
  }, [decks]);

  return (
    <View className='flex-1 justify-center'>
      {/*@ts-ignore*/}
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={[themes[selectedTheme].topGradient, themes[selectedTheme].bottomGradient]} className="flex-1 items-center justify-center">
        <View className='absolute top-1' style={{ marginTop: 50, flex: 1 }}>
          {/*@ts-ignore*/}
          <Text style={{ fontWeight: 'semibold', fontSize: 24, color: themes[selectedTheme].text }} className='text-2xl px-3'>Select an existing deck below, or tap "Build Deck" to build a brand new one!</Text>
        </View>
        <View style={{ padding: 10, flex: 1 }}>
          {!true //Render Loading Effect, come back to center perfectly later. DOESN'T WORK PROPERLY YET...
            ?
            <View style={{ flex: 1, marginTop: 300 }}>
              {/*@ts-ignore*/}
              <ActivityIndicator size="large" color={themes[selectedTheme].text} />
            </View>
            :
            <View>
              <ScrollView style={{ flex: 1, marginTop: 150, marginBottom: 10, }}>
                <TouchableOpacity onPress={() => {
                  // @ts-ignore
                  navigation.navigate("Search");
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5 }}>
                    <Image source={require('@assets/add_playlist.png')} style={{ marginRight: 12, marginLeft: 0, width: 50, height: 50 }} />
                    {/*@ts-ignore*/}
                    <Text style={{ fontWeight: 'bold', fontSize: 24, color: themes[selectedTheme].text }}>Build Deck</Text>
                  </View>
                </TouchableOpacity>

                {componentHandler}

              </ScrollView>
            </View>
          }
        </View>
      </LinearGradient>
    </View>
  )
}

export default DeckScreen;