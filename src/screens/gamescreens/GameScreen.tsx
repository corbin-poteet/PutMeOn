import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Animated, Easing } from 'react-native'
import React, { useContext } from 'react'
import gameContext from '@/common/hooks/gameContext';
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native'
import TextTicker from 'react-native-text-ticker'
import useAudioPlayer from '@/common/hooks/useAudioPlayer';
//import database from "../../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
//import { push, ref, set, child, get } from 'firebase/database';


//DUETO List of stuff left to do on this page (delete as you finish them)
//Play the audio of correct track
//Fix issue where if you get the question wrong, the button choices are the same next round

var questionTypes: string[] = ['artist name', 'album name', 'name']; //lmao classic instance variable moment
let correctIndex: number;
let correctTrack: SpotifyApi.TrackObjectFull;
let speed: number = 25;

const GameScreen = () => {

  const isFocused = useIsFocused() //Checks if screen is being looked at
  const [fadeAnim] = React.useState(new Animated.Value(0))
  const navigation = useNavigation();
  const { round, score, setScore, setEarnings } = useContext(gameContext);
  const { spotify } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      gestureEnabled: false, //can be set to false to disable swipe out of page
      gestureDirection: 'horizontal',
    });

    

  }, [navigation]);

  //sound states

  const { audioPlayer } = useAudioPlayer();

  const [loaded, setLoaded] = React.useState<boolean>(false);

  //track states
  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  //const [correctTrack, setCorrectTrack] = React.useState<SpotifyApi.TrackObjectFull>();

  async function getTracks() { //get tracks -- pulled from swiper.tsx - pulls 4 tracks from API and puts them into the useState array

    const topArtistsIds = await spotify.getMyTopArtists({ limit: 4 }).then( 
      function (data: { items: any[]; }) {
        return data.items.map((artist: any) => artist.id);
      },
      function (err: any) {
        console.error(err);
      }
    ).catch((err) => {
      console.log(err);
    }) as string[];

    const recResponse = await spotify.getRecommendations({
      seed_artists: topArtistsIds,
      limit: 4,
    });

    const trackIds = recResponse.tracks.map((track: any) => track); //Removed the old track?.id value

    setTracks(trackIds);
    return;
  }

  var questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]; //randomize question type for the round (instance varibale Xdddd)

  //useEffect to get tracks once on load and set the correct track
  React.useEffect(() => {
    if (isFocused == true) {
      console.log("GETTING TRACKS")
      getTracks();
      Animated.timing(fadeAnim, { //Establish Animation
        toValue: 1,
        duration: 750,
        delay: 1000,
        useNativeDriver: true
      }).start();

    }
  }, [isFocused]);

  React.useEffect(() => {
    if (tracks.length >= 4) {
      correctTrack = tracks[0]; //correct track selection starts as the first index of the tracks array
      audioPlayer.setTrack(correctTrack);
      for (let i = 0; i < tracks.length; i++) {
        console.log("TRACK " + i + ": " + tracks[i]?.name);
      }
      // @ts-ignore
      correctIndex = parseInt(Math.random() * tracks.length); //Randomize correct track index

      let trackStack = tracks;

      let temp = trackStack[correctIndex]; //Swap tracks
      trackStack[correctIndex] = trackStack[0]; //Correct track starts at the beginning of the array
      trackStack[0] = temp;

      setTracks(trackStack); //set Use States to confirm generation of tracks is successful
      setLoaded(true);
    }
  }, [tracks]);

  //function to handle the press of buttons 1 - 4
  function handleChoice(index: number) { 
    console.log(tracks[index]);
    
    audioPlayer.stop();

    if (correctTrack == tracks[index]) {
      // @ts-ignore
      setScore(score + 10); //these work don't mind the errors
      // @ts-ignore
      setEarnings(10);
      console.log("CORRECTCHOICE");
    }
    else {
      console.log("WRONGCHOICE");
      // @ts-ignore
      setEarnings(0);
    }
    setLoaded(false);
    // @ts-ignore
    navigation.navigate('Score');
  };

  function buttonContent(buttonNum: number) {
    if (questionType == "name") {
      return tracks[buttonNum].name;
    }
    else if (questionType == "artist name") {
      return tracks[buttonNum].artists?.map((artist: any) => artist?.name).join(', ');
    }
    else if (questionType == "album name") {
      return tracks[buttonNum].album?.name;
    }
  }

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View className='flex-1 items-center flex-1'>
        <Text className='text-white text-4xl text-center px-1 my-16 font-bold'>Round {round}</Text>
      </View>
      {!(loaded) ?
        <View className='flex-1 justify-center'>
          <ActivityIndicator size="large" color="#014871" />
        </View>
        :
        <Animated.View style={{ opacity: fadeAnim }} className='flex-1 justify-center items-center absolute top-32 mx-2' >
          <View className='flex-1 justify-center items-center'>
            <View className='flex-1 justify-left items-left mx-2'>
              {/*track Image*/}
              <View className='flex-1 items-center p-2'>
                <Image source={/*require('@assets/blank_playlist.png')*/{ uri: correctTrack?.album?.images[0]?.url }} className='w-60 h-60' />
              </View>
              {/*Track Name*/}
              <View className='flex-row items-center px-2'>
                <TextTicker
                  scrollSpeed={speed}
                  loop
                  numberOfLines={1}
                  animationType={'scroll'}
                  easing={Easing.linear}
                  repeatSpacer={25}
                  className='text-white text-2xl font-bold'>{(questionType == 'name') ? '???????' : correctTrack?.name}
                </TextTicker>
              </View>
              {/* Artist Name */}
              <View className='flex-row items-center opacity-80 px-2'>
                <FontAwesome5 name="user-alt" size={16} color="white" />
                <TextTicker
                  scrollSpeed={speed}
                  loop
                  numberOfLines={1}
                  animationType={'scroll'}
                  easing={Easing.linear}
                  repeatSpacer={25}
                  className='px-2 text-white text-xl font-bold'>
                  {(questionType == 'artist name') ? '???????' : correctTrack?.artists?.map((artist: any) => artist?.name).join(', ')}
                </TextTicker>
              </View>
              {/* Album Name */}
              <View className='flex-row items-center opacity-80 px-2'>
                <FontAwesome5 name="compact-disc" size={16} color="white" />
                <TextTicker
                  scrollSpeed={speed}
                  loop
                  numberOfLines={1}
                  animationType={'scroll'}
                  easing={Easing.linear}
                  repeatSpacer={25}
                  className='px-2 text-white text-xl font-bold'>{(questionType == 'album name') ? '???????' : correctTrack?.album?.name}
                </TextTicker>
              </View>
            </View>

            {/*Question*/}
            <View className='flex-1 justify-center items-center'>
              <Text className='p-2 text-white text-3xl font-bold'>What is the {questionType} for this track?</Text>

              {/*Button choices*/}
              <TouchableOpacity className="flex-row items-center justify-center my-2 px-8 rounded-3xl" style={{ backgroundColor: '#014871' }}
                onPress={() => { handleChoice(0); }}>
                <Text numberOfLines={1}
                className="text-white text-xl px-30 py-2 text-1 font-semibold">{buttonContent(0)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className='flex-row items-center justify-center my-2 px-8 rounded-3xl' style={{ backgroundColor: '#014871' }}
                onPress={() => { handleChoice(1); }}>
                <Text numberOfLines={1}
                className="text-white text-xl px-30 py-2 text-1 font-semibold">{buttonContent(1)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className='flex-row items-center justify-center my-2 px-8 rounded-3xl' style={{ backgroundColor: '#014871' }}
                onPress={() => { handleChoice(2); }}>
                <Text numberOfLines={1}
                className="text-white text-xl px-30 py-2 text-1 font-semibold">{buttonContent(2)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className='flex-row items-center justify-center my-2 px-8 rounded-3xl' style={{ backgroundColor: '#014871' }}
                onPress={() => { handleChoice(3); }}>
                <Text numberOfLines={1}
                className="text-white text-xl px-30 py-2 text-1 font-semibold">{buttonContent(3)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      }
    </LinearGradient>
  );
};

export default GameScreen;
