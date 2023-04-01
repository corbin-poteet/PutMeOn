import { View, Text, Image, Slider, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef } from 'react'
import useAuth from '@/common/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import CardsSwipe from 'react-native-cards-swipe';
import { FontAwesome5 } from '@expo/vector-icons';
import database from "../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import { push, ref, set, child, update } from 'firebase/database';
import Scrubber from 'react-native-scrubber'
import { AntDesign } from '@expo/vector-icons';
import { selectedPlaylist } from '@screens/PlaylistScreen';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Foundation } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { StretchInX } from 'react-native-reanimated';
import Card from '@elements/Card';

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
  const cardRef = React.useRef();

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
    setTracks(trackStack);
    setDeckCounter(recResponse.tracks.length);

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
      limit: 5,
      
    });

    //Do To: try putting recs in new array and then concat with trackStack
    console.log("RECOMMENDATIONS: " + recResponse.tracks.length);
    trackStack = trackStack.concat(recResponse.tracks.map((track: any) => track));
    console.log("TRACKSTACK: " + trackStack.length);

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


  function tester() {
    console.log("TESTER");
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

    //loadAudio(tracks[cardIndex]);
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



  return (

    <CardsSwipe cards={tracks} renderCard={(track: SpotifyApi.TrackObjectFull) => {
      return (
        <Card ref={cardRef} track={track} />
      )
    }} onSwipedLeft={ //Add disliked song to the disliked database
      (index: number) => {
        setDeckCounter(deckCounter - 1);
        console.log("DECK COUNTER: " + deckCounter)
        if (deckCounter <= 5 && needsReload === false) {
          setReload(true);
        }

        console.log("NOPE: " + tracks[index].name)
        push(ref(database, "SwipedTracks/" + user?.id + "/DislikedTracks/"), {
          trackID: tracks[index].id,
          trackName: tracks[index].name
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
        push(ref(database, "SwipedTracks/" + user?.id + "/LikedTracks/"), {
          trackID: tracks[index].id,
          trackName: tracks[index].name
        })
        console.log("Playlist to add to: " + selectedPlaylist)
        const likedTrack: string[] = []
        likedTrack.push(tracks[index].uri)
        addToPlaylist(likedTrack)
      }
    }
      onSwiped={() => {
        console.log("SWIPED")
        setCardIndex(cardIndex + 1);
        sound && sound.unloadAsync();
        setPlaybackPosition(0);
        //loadAudio(tracks[cardIndex + 1]);
        cardRef.current?.onCardSwiped();
        console.log(cardRef.current);
      }}


    />
  )
}

export default Swiper