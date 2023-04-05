import { View, Text, Image, Slider, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef } from 'react'
import useAuth from '@/common/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import CardsSwipe from 'react-native-cards-swipe';
import { FontAwesome5 } from '@expo/vector-icons';
import database from "../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import { push, ref, set, child, get } from 'firebase/database';
import Scrubber from 'react-native-scrubber';
import { AntDesign } from '@expo/vector-icons'; 
import { selectedPlaylist } from '@screens/PlaylistScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Foundation } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { StretchInX } from 'react-native-reanimated';


type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
};

const Swiper = (props: Props) => {

  const { spotify, user } = useAuth();
  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [needsReload, setReload] = React.useState<boolean>(false);
  const [deckCounter, setDeckCounter] = React.useState<number>(0);
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [cardIndex, setCardIndex] = React.useState<number>(0);
  const [playbackPosition, setPlaybackPosition] = React.useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = React.useState<number>(0);

  let trackStack: SpotifyApi.TrackObjectFull[] = [];

  //previously known as getTracks
  async function initializeTracks() {

    const topArtistsIds = await spotify.getMyTopArtists({ limit: 5 }).then(
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
      limit: 20,
    });

    const trackIds = recResponse.tracks.map((track: any) => track.id);

    

    await spotify.containsMySavedTracks(trackIds).then(
      // after promise returns of containsMySavedTracks
      function (isSavedArr: any[]) {
        console.log("PROMISE RETURNED" + isSavedArr);
        isSavedArr.forEach((element) => {
          console.log(element);
          if (element === true) {
            console.log("Removing from tracks: " + recResponse.tracks[isSavedArr.indexOf(element)].name);

            recResponse.tracks.splice(isSavedArr.indexOf(element), 1);

            console.log("Updated length: " + recResponse.tracks.length);
          }
        });
          
        }
    ).catch((err) => {
      console.log(err);
    });
    
    trackStack = recResponse.tracks.map((track: any) => track);

    //remove tracks with no preview url
    trackStack.forEach(element => {
      if(element.preview_url === null){
        console.log("Null preview detected, Removing from tracks: " + element.name);
        trackStack.splice(trackStack.indexOf(element), 1);
      }
    });

    setTracks(trackStack);
    setDeckCounter(trackStack.length);
  }

  async function updateTracks() {

    let trackStack = tracks;
    console.log("trackstack beginning of function: " + trackStack.length);
    console.log("tracks usestate beginning of function: " + tracks.length);


    const topArtistsIds = await spotify.getMyTopArtists({ limit: 5 }).catch(
      function (err: any) {
        //console.error(err);
      }
    ).then(
      function (data) {
        return data?.items.map((artist: any) => artist.id);
      },
      function (err: any) {
        console.error(err);
      }
    ) as string[];

    const recResponse = await spotify.getRecommendations({
      seed_artists: topArtistsIds,
      limit: 30,
      
    });

    //Do To: try putting recs in new array and then concat with trackStack
    console.log("RECOMMENDATIONS: " + recResponse.tracks.length);

    //remove tracks with no preview url
    recResponse.tracks.forEach(element => {
      if(element.preview_url === null){
        console.log("Null preview detected in updateTracks(), Removing from tracks: " + element.name);
        recResponse.tracks.splice(recResponse.tracks.indexOf(element), 1);
      }
    });

    trackStack = trackStack.concat(recResponse.tracks.map((track: any) => track));
    console.log("TRACKSTACK: " + trackStack.length);

    trackStack.forEach(element => {
      
      
    });

        await spotify.containsMySavedTracks(
          recResponse.tracks.map((track: any) => track.id)
         ).then(
          // after promise returns of containsMySavedTracks
          function (isSavedArr: any[]) {
            console.log("PROMISE RETURNED" + isSavedArr);
            isSavedArr.forEach((element) => {
              console.log(element);
              if (element === true) {
                console.log("Removing from tracks: " + trackStack[isSavedArr.indexOf(element) + (trackStack.length - deckCounter)]?.name);

                trackStack.splice(isSavedArr.indexOf(element) + (trackStack.length - deckCounter), 1);

                console.log("Updated length: " + trackStack.length);
              }
            });
            
          }
        ).catch((err) => {
      //console.log(err);
        });

        setTracks(trackStack);
        setDeckCounter(trackStack.length);

  }

  // async function getRecentlyPlayedTracks() {
  //   const response = await spotify.getMyRecentlyPlayedTracks();
  //   const tracks = response.items.map((item: any) => item.track);
  //   setRecentTracks(tracks);
  // }


  async function needsToBeRemoved(tracks: any[]) {
    const trackIds = tracks.map((track: any) => track.id);
    const response = await spotify.containsMySavedTracks(trackIds);
    
  }



  async function addToPlaylist(trackURIs: string[]) {
    //console.log("PLAYLIST ID: "+selectedPlaylist);
    const response = await spotify.addTracksToPlaylist(selectedPlaylist, trackURIs);
  }


  React.useEffect(() => {
    //previously known as getTracks
    initializeTracks();
  }, []);

  // React.useEffect(() => {
  //   getRecentlyPlayedTracks();
  // }, []);



  React.useEffect(() => {
    sound ? sound.unloadAsync() : null;

    loadAudio(tracks[cardIndex]);
  }, []);





  React.useEffect(() => {
    if (needsReload) {
      updateTracks();
      setReload(false);
    }
  }, [needsReload]);

  if (tracks.length === 0) { //Loading Activity Indicator Animation
    return (
      <View style={{ flex: 1, marginTop: 300 }}>
        <ActivityIndicator size="large" color="#014871" />
      </View>
    )
  } 

  const b = false;
  //const [sound, setSound] = React.useState<any>();

  async function onPlaybackStatusUpdate(playbackStatus: any) {
    if (playbackStatus.isLoaded) {
      setPlaybackPosition(playbackStatus.positionMillis);
      setPlaybackDuration(playbackStatus.durationMillis);
    }
  }

  async function loadAudio(track: SpotifyApi.TrackObjectFull) {
    if (track == null) {
      return;
    }

    if (track.preview_url == null) {
      return;
    }


    const { sound } = await Audio.Sound.createAsync(
      { uri: track.preview_url },
      { shouldPlay: true }
    );

    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
    sound.setProgressUpdateIntervalAsync(25);
    setSound(sound);

    await sound.playAsync();
    setIsPlaying(true);
  }

  async function playAudio() {
    if (sound == null) {
      return;
    }

    await sound.playAsync();
    setIsPlaying(true);
  }

  async function pauseAudio() {
    if (sound == null) {
      return;
    }

    await sound.pauseAsync();
    setIsPlaying(false);
  }

  async function stopAudio() {
    if (sound == null) {
      return;
    }

    await sound.stopAsync();
    setIsPlaying(false);
  }

  async function setAudioPosition(position: number) {
    if (sound == null) {
      return;
    }
    
    setPlaybackPosition(position);
    await sound.setPositionAsync(position);
  }

  async function togglePlayAudio() {
    if (sound == null) {
      return;
    }

    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  

  return (

    <CardsSwipe cards={tracks} renderCard={(track: SpotifyApi.TrackObjectFull) => {

      return (
        <LinearGradient start={{ x: 0, y: 0 }} locations={[0.67, 1]} colors={['#3F3F3F', 'rgba(1,1,1,1)']} className="relative w-full h-full rounded-2xl"  >
          <View className='absolute left-4 right-4 top-8 bottom-0 opacity-100 z-0'>
            <View className='flex-1 justify-start items-start'>
              <View className='relative justify-center items-center w-full aspect-square justify-start'>
                <Image source={{ uri: track.album.images[0].url }} className='absolute w-full h-full' />
              </View>
              <View className='pt-2 px-0 w-full justify-start items-start pt-4'>
                {/* Track Name */}
                <View className='flex-row items-end'>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                  >
                    <Text className='text-white text-5xl font-bold'>{track.name}</Text>
                  </ScrollView>
                </View>
                {/* Artist Name */}
                <View className='flex-row items-center opacity-80'>
                  <FontAwesome5 name="user-alt" size={16} color="white" />
                  <Animated.ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Text className='px-2 text-white text-xl'>{
                      track.artists.map((artist: any) => artist.name).join(', ')
                    }</Text>
                  </Animated.ScrollView>
                </View>
                {/* Album Name */}
                <View className='flex-row items-center opacity-80'>
                  <FontAwesome5 name="compact-disc" size={16} color="white" />
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Text className='px-2 text-white text-xl'>{track.album.name}</Text>
                  </ScrollView>
                </View>
                {track?.preview_url ?
                  <View>
                <View className='flex-row'>
                      <Scrubber
                        value={sound ? playbackPosition / 1000 : 0}
                        onSlidingComplete={(value: number) => {
                          setAudioPosition(value * 1000);
                          //playAudio();
                        }}
                        onSlidingStart={() => {
                          //pauseAudio();
                        }}
                        // caused lag
                        // onSlide={(value: number) => {
                        //   setAudioPosition(value * 1000);
                        // }}
                        totalDuration={sound ? Math.ceil(playbackDuration / 1000) : 0}
                        trackColor='#29A3DA'
                        scrubbedColor='#29A3DA'
                  />
                </View>
                    <View className='flex-row justify-center items-center w-full'>
                      <View className='flex-row justify-center items-center align-center'>
                        <TouchableOpacity className='rounded-full py-0' onPress={() => { togglePlayAudio(); }}>
                          <Ionicons name={isPlaying ? "pause-circle-sharp" : "play-circle-sharp"} size={84} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  : null}
              </View>
            </View>
          </View>
        </LinearGradient >
      )
    }} onSwipedLeft={ //Add disliked song to the disliked database
      (index: number) => {
        setDeckCounter(deckCounter - 1);
        console.log("DECK COUNTER: " + deckCounter)
        if (deckCounter <= 5 && needsReload === false) {
          setReload(true);
        }

        console.log("NOPE: " + tracks[index].name)
        set(ref(database, "SwipedTracks/" + user?.id + "/DislikedTracks/" + tracks[index].id), {
          trackID: tracks[index].id, 
          trackName: tracks[index].name,
        })
      } 
    } onSwipedRight={ //Add liked songs to the liked database
      (index: number) => {
        setDeckCounter(deckCounter - 1);
        console.log("DECK COUNTER: " + deckCounter)
        if (deckCounter <= 5 && needsReload === false) {
          setReload(true);
        }

        console.log("LIKE: " + tracks[index].name)
        set(ref(database, "SwipedTracks/" + user?.id + "/LikedTracks/" + tracks[index].id), {
          trackID: tracks[index].id, 
          trackName: tracks[index].name,
        })
        console.log("Playlist to add to: " + selectedPlaylist)
        const likedTrack: string[] = []
        likedTrack.push(tracks[index].uri)
        addToPlaylist(likedTrack)

        // Query Firebase Test
        
        //const dbRef = ref(database);
        //
        // get(child(dbRef, "SwipedTracks/" + user?.id + "/LikedTracks/0pa7VuLNtAOxFZPAMSZsZs/")).then((snapshot)=>{
        //    if(snapshot.exists()) {
        //       let temp = snapshot.val().trackName;
        //       console.log("QUERY TRACK NAME BY ID : " + temp);
        //       let orary = snapshot.val().trackID;
        //       console.log("QUERY TRACK ID BY ID : " + orary);
        //    } else {
        //       console.log("No valid data was found here");
        //    }
        //  }).catch((error) => {
        //    console.log("Query Failed, error; " + error)
        //  });

      }
    }
      onSwipeEnd={() => {
        console.log("SWIPED")

        //tracks.shift();

        setCardIndex(cardIndex + 1);
        sound && sound.unloadAsync();
        setPlaybackPosition(0);
        loadAudio(tracks[cardIndex + 1]);
        
        

        //log tracks.name for all tracks in the array
        for (let i = 0; i < tracks.length; i++) {
          console.log("TRACK NAME: " + tracks[i].name)
        }

      }}


    />
  )
}

export default Swiper