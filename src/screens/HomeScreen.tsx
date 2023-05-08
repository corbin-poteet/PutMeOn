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
import SwiperComponent from '@/common/components/SwiperComponent';
import DeckManager from '@/common/components/DeckManager';
import useAudioPlayer from '@/common/hooks/useAudioPlayer';
import useTheme from '@/common/hooks/useThemes';
import { async } from '@firebase/util';
import useDeckManager from '@/common/hooks/useDeckManager';

const HomeScreen = () => {
  const navigation = useNavigation(); //Establish stack navigation
  const [konami, setKonami] = React.useState<number>(0);
  const { user } = useAuth();
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const isFocused = useIsFocused() //Checks if screen is being looked at
  const { deckManager } = useDeckManager(); //Maintain deck manager

  const { themes, selectedTheme } = useTheme(); //Allows dynamic theme color changing

  const { audioPlayer } = useAudioPlayer(); //Maintain audio player

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
    }
  }, [user, isFocused]);

  React.useEffect(() => {
    if (deckManager && deckManager.isInitialized) {
      deckManager.getDecksFromDatabase().then((decks) => {
        if (decks.length == 0) {
          console.log("MOVING TO DEMO")
          // @ts-ignore
          navigation.navigate('Welcome'); //No selected deck in DB means that the user is brand new, send them to the demo!
        }
      }).catch((error) => {
        console.log("ERROR GETTING DECKS: " + error)
      })
    }
  }, [deckManager]);

  return (
    //@ts-ignore
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={[themes[selectedTheme].topGradient, themes[selectedTheme].bottomGradient]} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <SafeAreaView className='flex-1' edges={['top']}>
        {/* <ImageBackground source={require('@assets/Swipe_Concept_v2.png')} className='flex-1'> */}

        {/* Header */}
        <View className='items-center relative'>
          <TouchableOpacity className='absolute left-5 top-3' onPress={
            () => {
              if (audioPlayer) {
                audioPlayer.pause();
              }

              // @ts-ignore
              navigation.navigate('UserInfo')
            }
          }>
            {
              userImage !== null //Sets user image, if one exists, otherwise uses default blank image
                ?
                <Image source={{ uri: userImage }} className="w-10 h-10 rounded-full" style={{ borderWidth: 2, borderColor: themes[selectedTheme].logo }} />
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
                //@ts-ignore
                tintColor: themes[selectedTheme].logo
              }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className='absolute right-5 top-3' onPress={
            () => {
              if (audioPlayer) {
                audioPlayer.pause();
              }

              // @ts-ignore
              navigation.navigate('Decks');
            }
          }>
            {/*@ts-ignore*/}
            <MaterialCommunityIcons className='' name="cards-outline" size={40} color={themes[selectedTheme].logo} />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View className='flex-1 items-center justify-center'>
          <View className='h-full w-full px-2 pt-1 pb-2'>
            <SwiperComponent />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
}

export default HomeScreen;