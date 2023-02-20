import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';
import { Audio } from 'expo-av';

const HomeScreen = () => {

  const [sound, setSound] = React.useState<Audio.Sound | null>(null);

  const navigation = useNavigation();
  const { logout, spotify, user } = useAuth();
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [tracks, setTracks] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [recentlyPlayedTrackIds, setRecentlyPlayedTrackIds] = React.useState<string[]>([]);

  // spotify.searchTracks('Paramore').then(
  //   function (data) {
  //     setTracks(data.tracks.items);
  //   },
  //   function (err) {
  //     console.error(err);
  //   }
  // );

  // function that returns an array of recently played song ids, taking in a parameter of the limit.
  async function getRecentlyPlayedTracks(historyLimit) {
    const recentTrackIds = [] as string[];
    const recentlyPlayed = await spotify.getMyRecentlyPlayedTracks({ limit: historyLimit }).then(
      function(data){
        data.items.forEach(element => {
          recentTrackIds.push(element.track.id);
        });
      }
    )
    setRecentlyPlayedTrackIds(recentTrackIds)
    recentTrackIds.length = 0
    return recentlyPlayedTrackIds;
  }

  async function getTracks() {
    if (loaded) {
      return;
    }

    const topArtistsIds = await spotify.getMyTopArtists({ limit: 2 }).then(
      function (data) {
        return data.items.map((artist: any) => artist.id);
      },
      function (err) {
        console.error(err);
      }
    ) as string[];

    spotify.getRecommendations({
      seed_artists: topArtistsIds,
      limit: 100,
    }).then(
      function (data) {
        setTracks(data.tracks);
        setLoaded(true);
      },
      function (err) {
        console.error(err);
      }
    );
  }

  React.useEffect(() => {
    getTracks();
  }, [user, spotify]);

  React.useEffect(() => {
    getRecentlyPlayedTracks(50);
  }, []);



  async function playPreview(cardIndex: number) {
    const currentTrack = tracks[cardIndex];

    if (currentTrack.preview_url === null) {
      return;
    }

    if (this.sound) {
      await this.sound.unloadAsync().catch((error) => console.log(error));
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
    }
  }, [user])

  return (
    <SafeAreaView className='flex-1'>
      <View className='items-center relative'>
        <TouchableOpacity className='absolute left-5 top-3' onPress={
          () => {
            navigation.navigate('User')
          }
        }>
          <Image source={{ uri: userImage }} className="w-10 h-10 rounded-full" />
        </TouchableOpacity>
        <TouchableOpacity >
          <Image source={require('../../assets/Logo_512.png')} style={{
            width: 128,
            height: 65,
            transform: [{ translateX: -6 }],
            resizeMode: 'contain',
          }} />
        </TouchableOpacity>
      </View>

      <View className='flex-1 -mt-6'>
        <Swiper
          cards={tracks}
          containerStyle={{ backgroundColor: "transparent" }}
          stackSize={3}
          cardIndex={0}
          cardVerticalMargin={80}
          animateCardOpacity
          animateOverlayLabelsOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => { console.log("dislike") }}
          onSwipedRight={(cardIndex) => { console.log("like") }}
          onSwiped={(cardIndex) => {
            console.log(tracks[cardIndex].artists[0].name + " - " + tracks[cardIndex].name);
            
            playPreview(cardIndex + 1);

          }}
          onSwipedAll={() => { console.log('onSwipedAll') }}
          onTapCard={(cardIndex) => { console.log(cardIndex) }}
          onSwipedTop={() => { console.log('onSwipedTop') }}
          onSwipedBottom={() => { console.log('onSwipedBottom') }}
          cardStyle={{ backgroundColor: "transparent" }}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: {
                label: {
                  backgroundColor: 'red',
                  borderColor: 'red',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: -30
                }
              }
            },
            right: {
              title: 'LIKE',
              style: {
                label: {
                  backgroundColor: 'green',
                  borderColor: 'green',
                  color: 'white',
                  borderWidth: 1
                },
                wrapper: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  marginTop: 30,
                  marginLeft: 30
                }
              }
            }
          }}
          

          

          renderCard={(card?) => {
            return (
              <View key={card?.id} style={styles.cardShadow} className='relative justify-center items-center bg-white h-3/4 rounded-xl'>
                <Image source={{ uri: card?.album.images[0].url }} className="w-64 h-64" />
                <Text className='text-2xl font-semibold'>{card?.name}</Text>
                <Text className='text-xl'>{card?.artists[0].name}</Text>
                <Text className='text-xl'>{card?.album.name}</Text>
              </View>
            )
          }}
        />
      </View>

      <View className='flex-row justify-center items-center'>
        <TouchableOpacity className='flex-row items-center justify-center bg-red-500 px-5 rounded-3xl'>
          <AntDesign name="close" size={24} color="white" />
          <Text className='text-white text-xl font-semibold'>Nope</Text>
        </TouchableOpacity>
        <TouchableOpacity className='flex-row items-center justify-center bg-green-500 px-5 rounded-3xl'>
          <Entypo name="check" size={24} color="white" />
          <Text className='text-white text-xl font-semibold'>Like</Text>
        </TouchableOpacity>
      </View>



    </SafeAreaView>
  )
}

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})