import { View, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Animated } from 'react-native'
import React, { useContext } from 'react'
import gameContext from '@/common/hooks/gameContext';
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useIsFocused } from '@react-navigation/native'
//import database from "../../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
//import { push, ref, set, child, get } from 'firebase/database';


//DUETO List of stuff left to do on this page (delete as you finish them)
//Create 3 different render screens for the 3 different question types
//Play the audio of correct track
//Find a way to make the page load a sec before displaying the album art, artist, and name. The info is undefined on render until the API call is made, so it crashes the app rn


var questionTypes: string[] = ['artist name', 'album name', 'name']; //lmao classic instance variable moment
let correctIndex: number;
let correctTrack: SpotifyApi.TrackObjectFull;

const GameScreen = () => {

  const isFocused = useIsFocused() //Checks if screen is being looked at

  const navigation = useNavigation();
  const { round, score, setScore, setEarnings } = useContext(gameContext);
  const { spotify } = useAuth();

  //sound states
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  //track states
  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  //const [correctTrack, setCorrectTrack] = React.useState<SpotifyApi.TrackObjectFull>();

  async function getTracks() { //get tracks -- pulled from swiper.tsx - pulls 4 tracks from API and puts them into the useState array

    const topArtistsIds = await spotify.getMyTopArtists({ limit: 4 }).then( // This is a good start but will need to exclude seen songs before
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
    if(isFocused == true) {
      console.log("GETTING TRACKS")
      getTracks();
    }    
  }, [isFocused]);

  React.useEffect(() => {
    if (tracks.length >= 4) {
      correctTrack = tracks[0];
      for(let i = 0; i < tracks.length; i++) {
        console.log("TRACK "+i+": "+tracks[i]?.name);
      }
      correctIndex = parseInt(Math.random() * tracks.length); //Randomize correct track index

      let trackStack = tracks;

      let temp = trackStack[correctIndex]; //Swap tracks
      trackStack[correctIndex] = trackStack[0]; //Correct track starts at the beginning of the array
      trackStack[0] = temp;

      setTracks(trackStack);

      console.log("correct index: " + correctIndex);
      setLoaded(true);
    }
  }, [tracks]);

  //function to handle the press of buttons 1 - 4
  function handleChoice(index: number) {
    console.log(tracks[index]);
    if (correctTrack == tracks[index]) {
      setScore(score + 10); //these work don't mind the errors
      setEarnings(10);
      setLoaded(false);
      console.log("CORRECTCHOICE");
    }
    else {
      console.log("WRONGCHOICE");
      setEarnings(0);
    }
    navigation.navigate('Score');
  };

  function buttonContent(buttonNum: number) {
    if(questionType = "name"){
      return tracks[buttonNum].name;
    }
    else if (questionType = "artist name"){
      return correctTrack?.artists?.map((artist: any) => artist?.name).join(', ');
    }
    else if (questionType = "album name"){
      return correctTrack?.album?.name;
    }
  }

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View className='flex-1 items-center relative'>
        <Text className='text-white text-4xl text-center px-1 my-16 font-bold'>Round {round}</Text>
      </View>
      {!(loaded) ?
        <View style={{ flex: 1, marginTop: 300 }}>
          <ActivityIndicator size="large" color="#014871" />
        </View>
        :
        <View className='flex-1 justify-center absolute top-32 px-2'>
          <View className='flex-1 justify-center'>
            {/*track Image*/}
            <View className='flex-1 items-center p-2'>
              <Image source={/*require('@assets/blank_playlist.png')*/{ uri: correctTrack?.album?.images[0]?.url }} className='w-60 h-60' />
            </View>
            {/*Track Name*/}
            <View className='flex-row items-center px-2'>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
              >
                <Text className='text-white text-3xl font-bold'>{correctTrack?.name}</Text>
              </ScrollView>
            </View>
            {/* Artist Name */}
            <View className='flex-row items-center opacity-80 px-2'>
              <FontAwesome5 name="user-alt" size={16} color="white" />
              <Animated.ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Text className='px-2 text-white text-2xl font-bold'>
                  {correctTrack?.artists?.map((artist: any) => artist?.name).join(', ')}</Text>
              </Animated.ScrollView>
            </View>
            {/* Album Name */}
            <View className='flex-row items-center opacity-80 px-2'>
              <FontAwesome5 name="compact-disc" size={16} color="white" />
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <Text className='px-2 text-white text-2xl font-bold'>{correctTrack?.album?.name}</Text>
              </ScrollView>
            </View>
          </View>

          {/*Question*/}
          <View className='flex-1 justify-center'>
            <Text className='p-2 text-white text-3xl font-bold'>What is the {questionType} of this track?</Text>

            {/*Button choices*/}
            <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
              onPress={() => { handleChoice(0); }}>
              <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">{buttonContent(0)}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
              onPress={() => { handleChoice(1); }}>
              <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">{buttonContent(1)}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
              onPress={() => { handleChoice(2); }}>
              <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">{buttonContent(2)}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
              onPress={() => { handleChoice(3); }}>
              <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">{buttonContent(3)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </LinearGradient>
  );
};

export default GameScreen;
