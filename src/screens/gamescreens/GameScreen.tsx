import { View, Text, TouchableOpacity, Image, ScrollView, Animated } from 'react-native'
import React, { useContext } from 'react'
import gameContext from '@/common/hooks/gameContext';
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
//import database from "../../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
//import { push, ref, set, child, get } from 'firebase/database';


//DUETO List of stuff left to do on this page (delete as you finish them)
  //Create 3 different render screens for the 3 different question types
  //Shuffle the array to prevent question 1 from being correct every time
  //Put the shuffled array tracks into the four buttons
  //Play the audio of correct track
  //Find a way to make the page load a sec before displaying the album art, artist, and name. The info is undefined on render until the API call is made, so it crashes the app rn


var questionTypes: string[] = ['artist name', 'album name', 'name']; //lmao classic instance variable moment
  
const GameScreen = () => {

  const navigation = useNavigation();
  const { round, setRound, score, setScore, setEarnings } = useContext(gameContext);
  const { spotify} = useAuth();

  //sound states
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  //track states
  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  const [correctTrack, setCorrectTrack] = React.useState<SpotifyApi.TrackObjectFull>();

  console.log("EUHHHHGGHHHHHHHHHHH"); //its 4 in the morning please kill me

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

    const trackIds = recResponse.tracks.map((track: any) => track.id);

    setTracks(trackIds);
    return;
  }

  var questionType  = questionTypes[Math.floor(Math.random() * questionTypes.length)]; //randomize question type for the round (instance varibale Xdddd)

  //useEffect to get tracks once on load and set the correct track
  React.useEffect(() => {
    getTracks();
  }, []);

  React.useEffect(() => {
    setCorrectTrack(tracks[0]);
  }, [tracks]);
  

  console.log("PRE SHUFFLE: " + tracks);
  //shuffle the array
  console.log("POST SHUFFLE: " + tracks);

  //functions to handle the press of buttons 1 - 4
  function handleChoice1() {
    if(correctTrack == tracks[0]){
      setScore(score + 10); //these work don't mind the errors
      setEarnings(10);
      console.log("CORRECTCHOICE");
    }
    else console.log("WRONGCHOICE");
  };
  function handleChoice2() {
    if(correctTrack == tracks[1]){
      setScore(score + 10);
      setEarnings(10);
      console.log("CORRECTCHOICE");
    }
    else console.log("WRONGCHOICE");
  };
  function handleChoice3() {
    if(correctTrack == tracks[2]){
      setScore(score + 10);
      setEarnings(10);
      console.log("CORRECTCHOICE");
    }
    else console.log("WRONGCHOICE");
  };
  function handleChoice4() {
    if(correctTrack == tracks[3]){
      setScore(score + 10);
      setEarnings(10);
      console.log("CORRECTCHOICE");
    }
    else console.log("WRONGCHOICE");
  };
  

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View className='flex-1 items-center relative'>
        <Text className='text-white text-4xl text-center px-1 my-16 font-bold'>Round {round}</Text>
      </View>

      <View className='flex-1 justify-center absolute top-32'>
        {/*track Image*/}
        <View className='flex-1 items-center p-2'>
          <Image source={require('@assets/blank_playlist.png')/*{ uri: correctTrack.album.images[0].url }*/} className='w-60 h-60' />
        </View>
        {/*Track Name*/}
        <View className='flex-row items-center px-2'>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            <Text className='text-white text-3xl font-bold'>{/*correctTrack.name*/}Track Name</Text>
          </ScrollView>
        </View>
        {/* Artist Name */}
        <View className='flex-row items-center opacity-80 px-2'>
          <FontAwesome5 name="user-alt" size={16} color="white" />
          <Animated.ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text className='px-2 text-white text-2xl font-bold'>
              {/*correctTrack.artists.map((artist: any) => artist.name).join(', ')*/}Artist Name</Text>
          </Animated.ScrollView>
        </View>
        {/* Album Name */}
        <View className='flex-row items-center opacity-80 px-2'>
          <FontAwesome5 name="compact-disc" size={16} color="white" />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text className='px-2 text-white text-2xl font-bold'>Album Name{/*correctTrack.album.name*/}</Text>
          </ScrollView>
        </View>
      </View>

      {/*Question*/}
      <View className='flex-1 justify-center'>
        <Text className='p-2 text-white text-3xl font-bold'>What is the {questionType} of this track?</Text>
        
        {/*Button choices*/}
        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { handleChoice1(); }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Choice 1</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { handleChoice2(); }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Choice 2</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { handleChoice3(); }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Choice 3</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { handleChoice4(); }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Choice 4</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

export default GameScreen;