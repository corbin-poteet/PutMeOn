import { View, Text, Button, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native'
import React, { useMemo, useRef, useState, useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '@hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import CardsSwipe from 'react-native-cards-swipe';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import Swiper from '@/common/components/elements/Swiper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ref, child, get, set } from 'firebase/database';
import gameContext from '@/common/hooks/gameContext';
// @ts-ignore
import database from "../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import { useIsFocused } from '@react-navigation/native'

const HomeScreen = () => {
  const navigation = useNavigation(); //Establish stack navigation
  const [konami, setKonami] = React.useState<number>(0);
  const { user } = useAuth();
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [deckLoaded, setDeckLoaded] = React.useState<boolean>(false);
  const [selectedDeck, setSelectedDeck] = React.useState<string>();
  const isFocused = useIsFocused() //Checks if screen is being looked at
  
  const { selectedPlaylist, setSelectedPlaylist } = useContext(gameContext); //Maintain selected playlists

  var tracks: any | any[] = [];
  
  const dbRef = ref(database); // load database

  React.useEffect(() => {
    if (konami >= 20) {
      // @ts-ignore
      navigation.navigate('Secret') //shhh....
    }
  }, [konami]);

  React.useEffect(() => { //If user is looking at Home screen
    if (user && isFocused) {
      if (user.images) {
        if (user.images.length > 0) {
          setUserImage(user.images[0].url)
        }
      }

      setLoaded(true) //We know spotify user credentials are loaded whenever the user is loaded
    }
  }, [user, isFocused]);
  
  React.useEffect(() => { //Load the selectedDeck
    if(loaded && user)
      checkDeck();
  }, [loaded]);

  React.useEffect(() => { //Once our deck query is attempted (after loaded, when selectedDeck is altered)
    if (loaded === true) {
      setDeckLoaded(true);
    }
  }, [selectedDeck])

  // TODO: Change this to check the database to see if the user has swiped on any songs
  React.useEffect(() => {
    if (deckLoaded === true) {
      if (selectedDeck !== undefined) {
        console.log('Found Deck and Loaded!');
      }
      else {
        console.log("MOVING TO DEMO")
        // @ts-ignore
        navigation.navigate('Welcome'); //Navigate to the welcome demo screen if user has not selected a playlist, change later
      }
    }
  }, [deckLoaded]); //check for cached credentials so we know if this is first time load 

  function checkDeck() {
    get(child(dbRef, "SelectedDecks/" + user?.id)).then((snapshot) => { //When User is obtained, establish database array
      if (snapshot.exists()) {
        var value = snapshot.val();
        setSelectedDeck(value?.id); 
        // @ts-ignore
        setSelectedPlaylist(value?.id); //Set selected spotify playlist in context 
        
      } else {
        set(ref(database, "Decks/" + user?.id +"/test"), {
          name: "test"
        });
        setSelectedDeck("failed_db_connection"); //I hate this. It is needed to ensure navigation to the demo screen.
        setSelectedDeck(undefined);
        
        console.log("Database connection failed");
      }
    });
  }

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#f0f2f4', '#f0f2f4']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <SafeAreaView className='flex-1' edges={['top']}>
        {/* <ImageBackground source={require('@assets/Swipe_Concept_v2.png')} className='flex-1'> */}

        {/* Header */}
        <View className='items-center relative'>
          <TouchableOpacity className='absolute left-5 top-3' onPress={
            () => {
              // @ts-ignore
              navigation.navigate('UserInfo')
            }
          }>
            {
              userImage !== null //Sets user image, if one exists, otherwise uses default blank image
                ?
                <Image source={{ uri: userImage }} className="w-10 h-10 rounded-full" style={{ borderWidth: 2, borderColor: 'black' }} />
                :
                <View>
                  <Image source={require('@assets/blank_user.png')} className="w-10 h-10 rounded-full" style={{ borderWidth: 2, borderColor: 'black' }} />
                </View>
            }
          </TouchableOpacity>
          <View>
            <TouchableOpacity activeOpacity={1} onPress={() => setKonami(konami + 1)}>
              <Image source={require('@assets/Logo_512_White.png')} style={{
                width: 128,
                height: 65,
                transform: [{ translateX: -6 }],
                resizeMode: 'contain',
                tintColor: '#01b1f1'
              }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className='absolute right-5 top-3' onPress={
            () => {
              // @ts-ignore
              navigation.navigate('Decks')
            }
          }>
            <MaterialCommunityIcons className='' name="cards-outline" size={40} color="#7d8490" />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View className='flex-1 items-center justify-center'>
          <View className='h-full w-full px-2 pt-1 pb-2'>
            <Swiper tracks={tracks} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default HomeScreen;