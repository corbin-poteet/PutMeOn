import { View, Text, Button, Image, TouchableOpacity, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
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
import { selectedPlaylist } from '@screens/PlaylistScreen';

const HomeScreen = () => {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null); //Audio playback hook
  const navigation = useNavigation(); //Establish stack navigation
  const [konami, setKonami] = React.useState<number>(0);
  const { spotify, user } = useAuth();
  const [userImage, setUserImage] = React.useState<string | null>(null);
  //const [tracks, setTracks] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [recentlyPlayedTracks, setRecentlyPlayedTracks] = React.useState<{}>({});
  var tracks: any | any[] = [];

  // async function getRecentlyPlayedTracks() {
  //   const recentlyPlayed = await spotify.getMyRecentlyPlayedTracks({ limit: 15 }).then(
  //     function(data){
  //       console.log("Here are your 15 recently played tracks: \n");
  //       data.items.forEach(element => {
  //         console.log(element.track.name);
  //       });

  //       var recentlyPlayedTracks = data.items;

  //       //setTracks(recentlyPlayedTracks);
  //       tracks = recentlyPlayedTracks;
  //       setLoaded(true);
  //       console.log("Data Items Tracks: \n");
  //       //console.log(data.items.map((item: { track: any; }) => item.track));
  //       //console.log(tracks);

  //       // loop through tracks
  //       // for (var i = 0; i < tracks.length; i++) {
  //       //   console.log(tracks[i].name);
  //       // } 
  //     }
  //   )
  //   setRecentlyPlayedTrackIds(recentTrackIds)
  //   recentTrackIds.length = 0
  //   return recentlyPlayedTrackIds;
  // }

  //React.useEffect(() => {
  //   Alert.alert('Welcome to Put Me On!', 'Swipe right to add a song you like to a playlist, swipe left to dislike it', [
  //     {
  //       text: 'Okay',
  //       style: 'cancel',
  //     }]);
  // }, []);


  React.useEffect(() => { 
    if(konami >= 20) {
      navigation.navigate('Secret') //shhh....
    }
  }, [konami]);

  async function playPreview(this: any, cardIndex: number) {
    const currentTrack = tracks[cardIndex];

    if (currentTrack.preview_url === null) {
      return;
    }

    if (this.sound) {
      await this.sound.unloadAsync().catch((error: any) => console.log(error));
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: currentTrack.preview_url },
      { shouldPlay: true }
    );
    if (sound) {
      setSound(sound);
      await sound.playAsync().catch((error) => console.log(error));
    }
  }

  React.useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync().catch((error) => console.log(error));
      }
      : undefined;
  }, [sound]);

  React.useEffect(() => {
    if (user) {
      if (user.images) {
        if (user.images.length > 0) {
          setUserImage(user.images[0].url)
        }
      }
      setLoaded(true) //We know spotify user credentials are loaded whenever the user is loaded
    }
  }, [user]);

  React.useEffect(() => { 
    if(!selectedPlaylist && loaded) {
      //navigation.navigate('Playlist') //Navigate to playlists screen if user doesn't have a playlist selected 
      navigation.navigate('Welcome') //Navigate to the welcome demo screen if user has not selected a playlist, change later
    }
  }, [loaded]); //check for cached credentials so we know if this is first time load 

  return (
    <SafeAreaView className='flex-1'>
      {/* <ImageBackground source={require('@assets/Swipe_Concept_v2.png')} className='flex-1'> */}

      <View className='items-center relative'>
        <TouchableOpacity className='absolute left-5 top-3' onPress={
          () => {
            navigation.navigate('Settings')
          }
        }>
          {
            userImage !== null
              ?
              <Image source={{ uri: userImage }} className="w-10 h-10 rounded-full" />
              :
              <View>
                <Image source={require('@assets/blank_user.png')} className="w-10 h-10 rounded-full" />
              </View>
          }
        </TouchableOpacity>
        <View>
          <TouchableOpacity activeOpacity={1} onPress={ () => setKonami(konami + 1)}>
            <Image source={require('@assets/Logo_512.png')} style={{
              width: 128,
              height: 65,
              transform: [{ translateX: -6 }],
              resizeMode: 'contain',
            }} />
          </TouchableOpacity>
        </View>
      </View>
      <View className='flex-1 items-center justify-center'>
        <View className='h-full px-2 pt-1 pb-2' style={{ aspectRatio: 9 / 16 }}>
          <Swiper tracks={tracks} />
        </View>
      </View>
    </SafeAreaView >
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green'
  },
  cardsSwipeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 40,
    zIndex: 1,
    elevation: 1,
    backgroundColor: 'yellow',
    height: '100%',
    aspectRatio: 0.75,
  },
  cardContainer: {
    width: '92%',
    height: '100%',
    padding: 2,
  },
  card: {
    aspectRatio: 9 / 16,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3.3,
    elevation: 6,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
  noMoreCard: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    padding: 14,
    borderWidth: 3,
    borderRadius: 35,
  },
  rightBtn: {
    borderColor: '#00D400',
  },
  leftBtn: {
    borderColor: '#E60000',
  },
  likeIcon: {
    width: 40,
    height: 40,
    top: -3,
  },
  dislikeIcon: {
    width: 40,
    height: 40,
    top: 3,
  },
  nope: {
    borderWidth: 5,
    borderRadius: 6,
    padding: 8,
    marginRight: 30,
    marginTop: 25,
    borderColor: 'red',
    transform: [{ rotateZ: '22deg' }],
  },
  nopeLabel: {
    fontSize: 32,
    color: 'red',
    fontWeight: 'bold',
  },
  like: {
    borderWidth: 5,
    borderRadius: 6,
    padding: 8,
    marginLeft: 30,
    marginTop: 20,
    borderColor: 'lightgreen',
    transform: [{ rotateZ: '-22deg' }],
  },
  likeLabel: {
    fontSize: 32,
    color: 'lightgreen',
    fontWeight: 'bold',
  },
});