import { View, Text, Button, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const PlaylistScreen = () => {

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <View className='absolute top-16'>
          <Text className='text-white text-4xl font-bold'>Select a Playlist</Text>
          <Text className='text-white text-2xl'>Songs that you like in Put Me On will be added to this playlist in Spotify</Text>
        </View>
        <ScrollView className='red absolute top-44'>
          <TouchableOpacity>
            <View>
              <Text className='text-red text-4xl font-bold absolute left-18'>IMG</Text>
              <Text className='text-white text-2xl font-bold'>Playlist Name Here</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View>
              <Text className='text-red text-4xl font-bold absolute left-18'>IMG</Text>
              <Text className='text-white text-2xl font-bold'>Playlist Name Here</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  )
}

export default PlaylistScreen