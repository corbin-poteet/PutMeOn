import { View, Text, Button, TouchableOpacity, Image, ScrollView, Alert, Animated, StyleSheet } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fromJSON } from 'postcss';
import { FontAwesome5 } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import database from "../../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import { push, ref, set, child, get } from 'firebase/database';
import useGameContext from '@/common/hooks/gameContext';

const GameScreen = () => {

  const navigation = useNavigation();
  const { round, score, earnings } = useGameContext();

  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = React.useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = React.useState<number>(0);

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
        <Text className='p-2 text-white text-3xl font-bold'>What is the _ of this _?{/*Question details here*/}</Text>
        
        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { navigation.navigate('Score') }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks{}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { /*Navigate based on correct, etc.*/ }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks{}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { /*Navigate based on correct, etc.*/ }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks{}</Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-center bg-green-500 px-2 m-2 rounded-3xl"
          onPress={() => { /*Navigate based on correct, etc.*/ }}>
          <Text className="text-white text-xl px-8 py-2 text-1 font-semibold">Multiple Decks{}</Text>
        </TouchableOpacity>
      </View>

    </LinearGradient>
  );
};

export default GameScreen;