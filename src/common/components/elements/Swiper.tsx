/* IMPORT STATEMENTS */
import {
  View,
  Text,
  Image,
  Slider,
  ScrollView,
  ActivityIndicator,
  Easing,
} from "react-native";
import React, { useEffect, useRef } from "react";
import useAuth from "@/common/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import CardsSwipe from "react-native-cards-swipe";
import { FontAwesome5 } from "@expo/vector-icons";
// @ts-ignore
import database from "../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import { push, ref, set, child, get } from "firebase/database";
import Scrubber from "react-native-scrubber";
import { AntDesign } from "@expo/vector-icons";
import { selectedPlaylist } from "@screens/DeckScreen";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Foundation } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { StretchInX } from "react-native-reanimated";
import TextTicker from "react-native-text-ticker";

let speed: number = 25;

type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
};

const Swiper = (props: Props) => {
  /* VARIABLE/USESTATE DECLARATION */

  const { spotify, user } = useAuth();
  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  const [trackToBeAdded, setTrackToBeAdded] =
    React.useState<SpotifyApi.TrackObjectFull>();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [needsReload, setReload] = React.useState<boolean>(false);
  const [deckCounter, setDeckCounter] = React.useState<number>(0);
  const [sound, setSound] = React.useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [cardIndex, setCardIndex] = React.useState<number>(0);
  const [playbackPosition, setPlaybackPosition] = React.useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = React.useState<number>(0);
  const [isDefaultDeck, setIsDefaultDeck] = React.useState<boolean>(true);
  const [seedArtists, setSeedArtists] = React.useState<string[]>([]);
  const [seedGenres, setSeedGenres] = React.useState<string[]>([]);
  //Current deck object will be set to either default deck, or last deck used, no matter what
  const [currentDeck, setCurrentDeck] = React.useState<{
    seedArtistIds?: string[];
    seedGenres?: string[];
    playlistId: string;
    deckName: string;
  }>({
    seedArtistIds: [],
    seedGenres: [],
    playlistId: "",
    deckName: "",
  });

  let trackStack: SpotifyApi.TrackObjectFull[] = [];

  /****************************** FUNCTION DECLARATIONS *********************************/


  //function gets user's top 5 artists and returns them as an array of artist ids
  async function getTopArtists() {
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

    return topArtistsIds;
  }


  async function addTrack() {
    const topArtistsIds = await getTopArtists();

    let isValid: boolean = false;

    //Keeps pulling a new track until the track is valid (new and has a preview url)
    while (isValid === false) {
      const recResponse = await spotify.getRecommendations({
        seed_artists: topArtistsIds,
        limit: 1,
      });

      const trackId = recResponse.tracks.map((track: any) => track.id);

      await spotify
        .containsMySavedTracks(trackId)
        .then(
          // after promise returns of containsMySavedTracks
          function (isSavedArr: any[]) {
            console.log("PROMISE RETURNED" + isSavedArr);
            isSavedArr.forEach((element) => {
              console.log(element);
              if (element === true) {
                console.log(
                  "Removing from tracks: " +
                  recResponse.tracks[isSavedArr.indexOf(element)].name
                );

                recResponse.tracks.splice(isSavedArr.indexOf(element), 1);

                console.log("Updated length: " + recResponse.tracks.length);
              }
            });
          }
        )
        .catch((err) => {
          console.log(err);
        });

      if (recResponse.tracks.length === 0) {
        isValid = false;
        continue;
      }

      //remove tracks with no preview url
      recResponse.tracks.forEach((element) => {
        if (element.preview_url === null) {
          console.log(
            "Null preview detected, Removing from tracks: " + element.name
          );
          recResponse.tracks.splice(recResponse.tracks.indexOf(element), 1);
        }
      });

      if (recResponse.tracks.length === 0) {
        isValid = false;
        continue;
      }

      //check for duplicates in db here

      // if (recResponse.tracks.length === 0) {
      //   isValid = false;
      //   continue;
      // }

      const newTrack = recResponse.tracks.map((track: any) => track);
      const newTracksArray = tracks.concat(newTrack);
      setTracks(newTracksArray);
      isValid = true;
      break;
    }
  }

  //function that sets tracks usestate to an array of tracks based on the user's top 5 artists
  async function getTracks() {
    //Do To: For default deck, shuffle the seeds to be random assortment of top artists and genres/tracks
    const topArtistsIds = await getTopArtists();

    const recResponse = await spotify.getRecommendations({
      seed_artists: topArtistsIds,
      seed_genres: [],
      limit: 20,
    }).then(
      function (data: any) {
        return data;
      },
      function (err: any) {
        console.error(err);
      }
    ).catch((err) => {
      console.log(err);
    });

    //Update trackStack
    trackStack = recResponse.tracks.map((track: any) => track);
    //Cleaning time
    cleanTracks(trackStack);
    //Update tracks usestate
    setTracks(trackStack);
  }

  // Same as getTracks, but takes in seed parameters
  async function getTracksSeeded(seedArtists: string[], seedGenres: string[]) {

    const recResponse = await spotify.getRecommendations({
      seed_artists: seedArtists,
      seed_genres: seedGenres,
      limit: 25,
    }).then(
      function (data: any) {
        return data;
      },
      function (err: any) {
        console.error(err);
      }
    ).catch((err) => {
      console.log(err);
    });
    

    //trackIds is an array of the track IDs of the recommendations
    const trackIds = recResponse.tracks.map((track: any) => track.id);


    //Update trackStack
    trackStack = recResponse.tracks.map((track: any) => track);
    //Cleaning time
    cleanTracks(trackStack);
    //Update tracks usestate
    setTracks(trackStack);
  }

  // async function getRecentlyPlayedTracks() {
  //   const response = await spotify.getMyRecentlyPlayedTracks();
  //   const tracks = response.items.map((item: any) => item.track);
  //   setRecentTracks(tracks);
  // }

  async function cleanTracks(tracks: SpotifyApi.TrackObjectFull[]) {
    const trackIds = tracks.map((track: any) => track.id);

    //Removes tracks that are already in the user's library
    await spotify
      .containsMySavedTracks(trackIds)
      .then(
        // after promise returns of containsMySavedTracks
        function (isSavedArr: any[]) {
          console.log("containsMySavedTracks Promise Returned: " + isSavedArr);
          isSavedArr.forEach((element) => {
            console.log(element);
            if (element === true) {
              console.log(
                "Removing from tracks: " +
                tracks[isSavedArr.indexOf(element)].name
              );

              tracks.splice(isSavedArr.indexOf(element), 1);

              console.log("Updated length: " + tracks.length);
            }
          });
        }
      )
      .catch((err) => {
        console.log(err);
      });

    //Removes tracks with no preview url
    tracks.forEach((element) => {
      if (element.preview_url === null || element.preview_url === undefined) {
        console.log(
          "Null preview detected, Removing from tracks: " + element.name
        );
        tracks.splice(tracks.indexOf(element), 1);
      }
    });

    //remove song if detected as swiped from database, currently splice is not working
    const dbRef = ref(database);
    const trackIds2 = tracks.map((track: any) => track.id);
    trackIds2.forEach((trackId: string) => {
      get(child(dbRef, "SwipedTracks/" + user?.id + "/" + trackId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            tracks.splice(trackIds2.indexOf(trackId), 1);
            console.log(
              "SWIPED SONG DETECTED IN DB, REMOVING: " +
              snapshot.val().trackName
            );
          } else {
            console.log("Swiped song not found");
          }
        })
        .catch((error) => {
          console.log("Query Failed, error; " + error);
        });
    });

    console.log("Tracks length: " + tracks.length);
    return tracks;
  }

  async function loadDefaultDeck(){
    
  }

  async function loadCurrentDeck(){
    const dbRef = ref(database);
    get(child(dbRef, "Decks/" + user?.id + "/selectedDeck")).then((snapshot) => {
      if (snapshot.exists()) {
        if(snapshot.val().isDefaultDeck === true){
          console.log("Default deck found in db, loading default deck");
          getTracks();
        } else {
        console.log("Deck found in db, loading deck");
        getTracksSeeded(snapshot.val().seedArtists, snapshot.val().seedGenres);
        }
      } else {
        console.log("Deck not found in db, loading default deck");
        getTracks();
      }
    }).catch((error) => {
      console.log("Query Failed, error; " + error)
    });
  }

  async function addToPlaylist(trackURIs: string[]) {
    //console.log("PLAYLIST ID: "+selectedPlaylist);
    const response = await spotify.addTracksToPlaylist(
      selectedPlaylist,
      trackURIs
    );
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

    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
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

  async function onSwipeLeft(index: number) {
    if (!user) {
      return;
    }

    console.log("NOPE: " + tracks[index].name);
    set(
      ref(database, "SwipedTracks/" + user.id + "/" + tracks[index].id),
      {
        trackID: tracks[index].id,
        liked: false,
      }
    );
  }

  async function onSwipeRight(index: number) {
    if (!user) {
      return;
    }

    console.log("LIKE: " + tracks[index].name);
    set(
      ref(database, "SwipedTracks/" + user.id + "/" + tracks[index].id),
      {
        trackID: tracks[index].id,
        liked: true,
      }
    );
    //console.log("Playlist to add to: " + selectedPlaylist)
    const likedTrack: string[] = [];
    likedTrack.push(tracks[index].uri);
    addToPlaylist(likedTrack);
  }
  /******************** USE EFFECTS ***********************/
  React.useEffect(() => {
    //check last deck used in database. if default deck, use top artists as seed, else use appropriate seeds
    getTracks();
  }, []);

  React.useEffect(() => {
    sound ? sound.unloadAsync() : null;

    loadAudio(tracks[cardIndex]);
  }, []);

  // React.useEffect(() => {
  //   if (needsReload === true) {
  //     getTracks();
  //     setReload(false);
  //   }
  // }, [needsReload]);

  if (tracks.length === 0) {
    //Loading Activity Indicator Animation
    return (
      <View style={{ flex: 1, marginTop: 300 }}>
        <ActivityIndicator size="large" color="#014871" />
      </View>
    );
  }

  // ***************************************** CARD RENDERING ********************************
  return (
    <CardsSwipe
      cards={tracks}
      rotationAngle={15}
      renderCard={(track: SpotifyApi.TrackObjectFull) => {
        return (
          <LinearGradient style={{ borderWidth: 4, borderColor: '#c9cfd1' }}
            start={{ x: 0, y: 0 }}
            locations={[0.67, 1]}
            colors={["#1f1e1e", "#1f1e1e"]}
            className="relative w-full h-full rounded-2xl"
          >
            <View className="absolute left-4 right-4 top-8 bottom-0 opacity-100 z-0">
              <View className="flex-1 justify-start items-start">
                <View className="relative justify-center items-center w-full aspect-square justify-start">
                  <Image
                    source={{ uri: track.album.images[0].url }}
                    className="absolute w-full h-full"
                  />
                </View>
                <View className="pt-2 px-0 w-full justify-start items-start pt-4">
                  {/* Track Name */}
                  <View className="flex-row items-end">
                    <TextTicker
                      scrollSpeed={speed}
                      loop
                      numberOfLines={1}
                      animationType={"scroll"}
                      easing={Easing.linear}
                      repeatSpacer={25}
                      className="text-white text-5xl font-bold"
                    >
                      {track.name}
                    </TextTicker>
                  </View>
                  {/* Artist Name */}
                  <View className="flex-row items-center opacity-80">
                    <FontAwesome5 name="user-alt" size={16} color="white" />
                    <Animated.ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    >
                      <TextTicker
                        scrollSpeed={speed}
                        loop
                        numberOfLines={1}
                        animationType={"scroll"}
                        easing={Easing.linear}
                        repeatSpacer={25}
                        className="px-2 text-white text-xl"
                      >
                        {track.artists
                          .map((artist: any) => artist.name)
                          .join(", ")}
                      </TextTicker>
                    </Animated.ScrollView>
                  </View>
                  {/* Album Name */}
                  <View className="flex-row items-center opacity-80">
                    <FontAwesome5 name="compact-disc" size={16} color="white" />
                    <TextTicker
                      scrollSpeed={speed}
                      loop
                      numberOfLines={1}
                      animationType={"scroll"}
                      easing={Easing.linear}
                      repeatSpacer={25}
                      className="px-2 text-white text-xl"
                    >
                      {track.album.name}
                    </TextTicker>
                  </View>
                  {track?.preview_url ? (
                    <View>
                      <View className="flex-row">
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
                          totalDuration={
                            sound ? Math.ceil(playbackDuration / 1000) : 0
                          }
                          trackColor="#29A3DA"
                          scrubbedColor="#29A3DA"
                        />
                      </View>
                      <View className="flex-row justify-center items-center w-full">
                        <View className="flex-row justify-center items-center align-center">
                          <TouchableOpacity
                            className="rounded-full py-0"
                            onPress={() => {
                              togglePlayAudio();
                            }}
                          >
                            <Ionicons
                              name={
                                isPlaying
                                  ? "pause-circle-sharp"
                                  : "play-circle-sharp"
                              }
                              size={84}
                              color="white"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>
          </LinearGradient>
        );
      }}
      onSwiped={(index: number) => {
        console.log("SWIPED");

        setCardIndex(cardIndex + 1);
        sound && sound.unloadAsync();
        setPlaybackPosition(0);
        loadAudio(tracks[cardIndex + 1]);

        addTrack();
        console.log("tracks length: " + tracks.length);
      }}
      onSwipedLeft={
        //Add disliked song to the disliked database
        (index: number) => {
          onSwipeLeft(index).catch((err) => console.log(err));
        }
      }
      onSwipedRight={
        //Add liked songs to the liked database
        (index: number) => {
          onSwipeRight(index).catch((err) => console.log(err));
        }
      }
      renderYep={() => (
        <View
          style={{
            borderWidth: 5,
            borderRadius: 6,
            padding: 8,
            marginLeft: 30,
            marginTop: 20,
            borderColor: "lightgreen",
            transform: [{ rotateZ: "-22deg" }],
          }}
        >
          <Text
            style={{
              fontSize: 32,
              color: "lightgreen",
              fontWeight: "bold",
            }}
          >
            YEP
          </Text>
        </View>
      )}
      renderNope={() => (
        <View
          style={{
            borderWidth: 5,
            borderRadius: 6,
            padding: 8,
            marginRight: 30,
            marginTop: 25,
            borderColor: "red",
            transform: [{ rotateZ: "22deg" }],
          }}
        >
          <Text
            style={{
              fontSize: 32,
              color: "red",
              fontWeight: "bold",
            }}
          >
            NOPE
          </Text>
        </View>
      )}
      renderNoMoreCard={() => (
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-5xl font-bold">Fuck.</Text>
        </View>
      )}
    />
  );
};

export default Swiper;
