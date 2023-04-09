import { View, Text, TouchableOpacity, Image, ScrollView, Animated } from 'react-native'
import React, { useContext } from 'react'
import gameContext from '@/common/hooks/gameContext';
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import database from "../../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import { push, ref, set, child, get } from 'firebase/database';

var questionTypes: string[] = ['artist name', 'album name', 'name']; //lmao classic instance variable moment
  
const GameScreen = () => {

  const navigation = useNavigation();
  const { round, setRound } = useContext(gameContext);
  const { spotify, user } = useAuth();

  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = React.useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = React.useState<number>(0);

  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  const [correctTrack, setCorrectTrack] = React.useState<SpotifyApi.TrackObjectFull>();

  var questionType  = questionTypes[Math.floor(Math.random() * questionTypes.length)]; //randomize question type for the round (instance varibale Xdddd)

  console.log("EUHHHHGGHHHHHHHHHHH"); //its 4 in the morning please kill me

  //Pseudocode for this part:
  //DONE 1. Choose a guess type randomly (artist, album, or track)
  //1. Pull 4 tracks from API and put them in an array
  //2. Put the first track in the array into the correctTrack state
  //3. Shuffle the array
  //4. Put the shuffled array tracks into the four buttons
  //5. Play the correct track
  //6. When the user clicks a button, check if it's the correct track
  //7. Inform the user if correct, increment score and earnings, and round, and navigate to round screen again
  //8. Inform the user if incorrect and navigate to round screen again

  return (
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <View className='flex-1 items-center relative'>
        <Text className='text-white text-4xl text-center px-1 my-16 font-bold'>Round {round}</Text>
      </View>

      <View className='flex-1 justify-center absolute top-32'>
        {/*track Image*/}
        <View className='flex-1 items-center p-2'>
          <Image source={require('@assets/blank_playlist.png')/*{ uri: track.album.images[0].url }*/} className='w-60 h-60' />
        </View>
        {/*Track Name*/}
        <View className='flex-row items-center px-2'>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
          >
            <Text className='text-white text-3xl font-bold'>{/*track.name*/}Track Name</Text>
          </ScrollView>
        </View>
        {/* Artist Name */}
        <View className='flex-row items-center opacity-80 px-2'>
          <FontAwesome5 name="user-alt" size={16} color="white" />
          <Animated.ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text className='px-2 text-white text-2xl font-bold'>{
              /*track.artists.map((artist: any) => artist.name).join(', ')
            */}Artist Name</Text>
          </Animated.ScrollView>
        </View>
        {/* Album Name */}
        <View className='flex-row items-center opacity-80 px-2'>
          <FontAwesome5 name="compact-disc" size={16} color="white" />
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Text className='px-2 text-white text-2xl font-bold'>Album Name{/*track.album.name*/}</Text>
          </ScrollView>
        </View>
      </View>
      {/*Question*/}
      
      <View className='flex-1 justify-center'>
        <Text className='p-2 text-white text-3xl font-bold'>What is the {questionType} of this track?{/* Add variable instead of _ later with question type */}</Text>
        
        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { navigation.navigate('Score') }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Next screen (testing only)</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { setRound(round + 1); }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Increment round (testing only)</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { /*Navigate based on correct, etc.*/ }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { /*Navigate based on correct, etc.*/ }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

export default GameScreen;