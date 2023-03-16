import { View, Text, Button, TouchableOpacity, Image, ScrollView} from 'react-native'
import React from 'react'
import useAuth from '@hooks/useAuth';
import { useNavigation } from '@react-navigation/core';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

const PlaylistScreen = () => {

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Playlists"
    });
  }, [navigation]);

  return (
    <View className='flex-1 justify-center'>
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} className="flex-1 items-center justify-center">
        <View className='absolute top-1'>
          <Text className='text-white text-2xl px-3'>Songs that you like in Put Me On will be added to a playlist of your choice in Spotify: </Text>
        </View>
        <View style={{padding: 10, flex: 1}}>
          <ScrollView style={{flex: 1, marginTop: 100}}>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>Playlist Name</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>Rock</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>New Playlist</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                <Image source={require('@assets/blank_playlist.png')} style={{ marginRight: 12, marginLeft: 10, width: 75, height: 75 }}/>
                <Text style={{ fontWeight: 'bold', fontSize: 36, color: 'white'}}>LAST Playlist</Text>
              </View>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  )
}

export default PlaylistScreen