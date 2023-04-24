/* IMPORT STATEMENTS */
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Easing,
} from "react-native";
import React from "react";
import useAuth from "@/common/hooks/useAuth";
import { LinearGradient } from "expo-linear-gradient";
import CardsSwipe from "react-native-cards-swipe";
import { FontAwesome5 } from "@expo/vector-icons";
// @ts-ignore
import database from "../../../../firebaseConfig.tsx";
import { push, ref, set, child, get, getDatabase, onValue } from "firebase/database";
import Scrubber from "react-native-scrubber";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Audio } from "expo-av";
import TextTicker from "react-native-text-ticker";
import useAudioPlayer from "@/common/hooks/useAudioPlayer";

let speed: number = 25;
let selectedPlaylist: string;
type Props = {
  tracks: SpotifyApi.TrackObjectFull[];
};

const Swiper = (props: Props) => {
  /* VARIABLE/USESTATE DECLARATION */
  const { spotify, user } = useAuth();

  // Audio Player
  const { audioPlayer } = useAudioPlayer();
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [playbackPosition, setPlaybackPosition] = React.useState<number>(0);
  const [playbackDuration, setPlaybackDuration] = React.useState<number>(0);

  const [tracks, setTracks] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  const [tracksReserve, setTracksReserve] = React.useState<SpotifyApi.TrackObjectFull[]>([]);
  const [usingSeeds, setUsingSeeds] = React.useState<boolean>(false);
  const [cardIndex, setCardIndex] = React.useState<number>(0);

  const [swipedTrackIds, setswipedTrackIds] = React.useState<string[]>([]);
  const [topArtistsIds, setTopArtistIds] = React.useState<string[]>([]);
  const [loaded1, setLoaded1] = React.useState<boolean>(false);

  const [needsReload, setReload] = React.useState<boolean>(false);



  let trackStack: SpotifyApi.TrackObjectFull[] = [];
  //var topArtistIds: string[] = [];
  var isPromo = false;
  var promoCount = 0;
  const dbRef = ref(database); // load database


  /****************************** FUNCTION DECLARATIONS *********************************/

  async function loadSwipedArray() {
    const dbRef = ref(database);
    // query swiped tracks from the database and store them in an array
    get(child(dbRef, "SwipedTracks/" + user?.id)).then((snapshot) => { //When User is obtained, establish database array

      let temp: string[] = [];

      if (snapshot.exists()) {
        snapshot.forEach((element: any) => {
          const trackId = element.val().trackID;
          //console.log("Track id value pulled from db: " + trackId)
          temp.push(trackId); //Push db swiped song track id to an array (string)
        });
      } else {
        console.log("Failed to retrieve data from database")
      }
      setswipedTrackIds(temp);

    });

  }

  // async function loadTopArtists(numArtists: number = 5) {
  //   const topArtistsIds = await spotify.getMyTopArtists({ limit: numArtists }).then(
  //     function (data: { items: any[]; }) {
  //       return data.items.map((artist: any) => artist.id);
  //     },
  //     function (err: any) {
  //       console.error(err);
  //     }
  //   ).catch((err) => {
  //     console.log(err);
  //   }) as string[];

  //   setTopArtistIds(topArtistsIds);
  // }

  //function gets user's top 5 artists and returns them as an array of artist ids
  async function getTopArtists(numArtists: number = 5) {
    const topArtistsIds = await spotify.getMyTopArtists({ limit: numArtists }).then(
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

  async function reloadTracks() {
    console.log("reloading tracks");
    setTracks([]);
    var newTracksArray: SpotifyApi.TrackObjectFull[] = [];
    var addable: boolean = false;

    const recResponse = await spotify.getRecommendations({
      seed_artists: topArtistsIds,
      limit: 35,
    });

    //console.log(swipedTrackIds);

    const newTracks = recResponse.tracks.map((track: any) => track);
    const trackIds2 = newTracks.map((track: any) => track.id);

    for (let i = 0; i < newTracks.length; i++) {
      if (newTracks[i].preview_url !== null) {
        if (swipedTrackIds.includes(newTracks[i]) === false) {
          addable = true;
        }

        if (addable) {
          newTracksArray.push(newTracks[i]);
          console.log("Added track: " + newTracks[i].name);
        }
      }
    }
    setTracks(newTracksArray);
  }

  //pushes a new track to the tracks usestate, called on every swipe
  async function addTrack() {
    var addable: boolean = false;
    var topArtists: string[] = topArtistsIds;

    const recResponse = await spotify.getRecommendations({
      seed_artists: topArtists,
      limit: 15,
    });

    //console.log(swipedTrackIds);

    const newTracks = recResponse.tracks.map((track: any) => track);
    const trackIds2 = newTracks.map((track: any) => track.id);

    for (let i = 0; i < newTracks.length; i++) {
      if (newTracks[i].preview_url !== null) {
        if (swipedTrackIds.includes(newTracks[i]) === false) {
          addable = true;
        }

        if (addable) {
          const newTracksArray = tracks.concat(newTracks[i]);
          setTracks(newTracksArray);
          console.log("Added track: " + newTracks[i].name);
          break;
        }
      }
    }
  }

  async function getCleanedRecs(numRecs: number = 25, seedArtists: string[] = [], seedTracks: string[] = []) {

    if (usingSeeds) {
      // Get seeds from selectedDeck
    } else {
      seedArtists = topArtistsIds;
      //set seedTracks as track ids of 5 recently played tracks
      //seedTracks = await spotify.getMyRecentlyPlayedTracks({ limit: 5 })
    }

    //get recommendations
    const recResponse = await spotify.getRecommendations({
      seed_artists: seedArtists,
      seed_tracks: seedTracks,
      limit: numRecs,
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
  }

  async function getTracks() {

    const topArtists: string[] = topArtistsIds;
    const recResponse = await spotify.getRecommendations({
      seed_artists: topArtists,
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
    //trackStack = await cleanTracks(trackStack);
    cleanTracks(trackStack);
    //Update tracks usestate
    //setTracks(trackStack);
  }

  async function cleanTracks(tracks: SpotifyApi.TrackObjectFull[]) {
    const trackIds = tracks.map((track: any) => track.id);

    //Removes tracks that are already in the user's library
    await spotify
      .containsMySavedTracks(trackIds)
      .then(
        // after promise returns of containsMySavedTracks
        function (isSavedArr: any[]) {
          //console.log("containsMySavedTracks Promise Returned: " + isSavedArr);
          isSavedArr.forEach((element) => {
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


    //remove song if detected as swiped from database, currently splice is not working
    // const dbRef = ref(database);
    // const trackIds2 = tracks.map((track: any) => track.id);
    // trackIds2.forEach((trackId: string) => {
    //   get(child(dbRef, "SwipedTracks/" + user?.id + "/" + trackId))
    //     .then((snapshot) => {
    //       if (snapshot.exists()) {
    //         console.log("REMOVED BASED ON DB: " + trackId)
    //         tracks.splice(trackIds2.indexOf(trackId), 1);
    //         console.log(
    //           "SWIPED SONG DETECTED IN DB, REMOVING: " +
    //           snapshot.val().trackID
    //         );
    //         console.log("track removed?" + trackIds2.indexOf(trackId));
    //       } else {
    //         console.log("Swiped song not found");
    //       }
    //     })
    //     .catch((error) => {
    //       console.log("Query Failed, error; " + error);
    //     });
    // });


    //Removes tracks with no preview url
    tracks.forEach((element) => {
      if(swipedTrackIds.includes(element.id)){
        tracks.splice(tracks.indexOf(element), 1);
      }
      //console.log(element.name + "CLEAN TRACKS Preview Url: " + element.preview_url);
      if (element.preview_url == null || element.preview_url == undefined) {
        console.log(
          "Null preview detected, Removing from tracks: " + element.name
        );
        tracks.splice(tracks.indexOf(element), 1);
      }
    });

    for (let i = 0; i < tracks.length; i++) {
      if(tracks[i].preview_url === null){
        console.log("preview_url is null part twoooo removing " + tracks[i].name);
        tracks.splice(i, 1);
      }
    }

    for (let i = 0; i < tracks.length; i++) {
      if(tracks[i].preview_url === null){
        console.log("preview_url is null part THREEEE removing " + tracks[i].name);
        tracks.splice(i, 1);
      }
    }

    console.log("Tracks length after cleaning: " + tracks.length);
    console.log("setting tracks");
    setTracks(tracks);
    //return tracks;
  }

  async function loadCurrentDeck() {
    const dbRef = ref(database);
    get(child(dbRef, "SelectedDecks/" + user?.id)).then((snapshot) => {
      if (snapshot.exists()) {
        // if(snapshot.val().seedArtists.exists() && snapshot.val().seedGenres.exists()){
        //   console.log("Deck found in db, loading deck");
        //   getTracksSeeded(snapshot.val().seedArtists, snapshot.val().seedGenres);
        // }else{
        //   console.log("Deck found in db, loading default top artists deck");
        //   getTracks();
        // }
        //getCleanedRecs();
        getTracks();

      } else {
        console.log("Deck not found in db");
        //getTracks();
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

  async function onPlaybackStatusUpdate(playbackStatus: any) {
    if (playbackStatus.isLoaded) {
      setPlaybackPosition(playbackStatus.positionMillis);
      setPlaybackDuration(playbackStatus.durationMillis);
      setIsPlaying(!playbackStatus.isPlaying);
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

  function checkDeck() {
    get(child(dbRef, "SelectedDecks/" + user?.id)).then((snapshot) => { //When User is obtained, establish database array
      if (snapshot.exists()) {
        var value = snapshot.val();
        selectedPlaylist = value?.id;
      } else {
        console.log("Database connection failed in SWIPER component");
      }
    });
  }

  /******************** USE EFFECTS ***********************/
  React.useEffect(() => {
    //check last deck used in database. if default deck, use top artists as seed, else use appropriate seeds
    loadCurrentDeck();

  }, [loaded1]);

  // React.useEffect(() => {
  //   reloadTracks();
  //   setReload(false);
  // }, [needsReload]);

  React.useEffect(() => {
    audioPlayer.sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
  }, [audioPlayer]);

  React.useEffect(() => {
    loadSwipedArray();

    const loadTopArtists = async (numArtists: number = 5) => {
      const topArtistsIds = await spotify.getMyTopArtists({ limit: numArtists }).then(
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

    loadTopArtists().then((data) => {
      setTopArtistIds(data);
      console.log(topArtistsIds);
      var temp: boolean = true;
      setLoaded1(temp);
    });
  }, []);

  React.useEffect(() => {

    if (cardIndex == 0) {
      //sound && sound.unloadAsync();
      setPlaybackPosition(0);
      audioPlayer.setTrack(tracks[cardIndex]);
    }
  }, [tracks]);

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
      cardContainerStyle={{ borderRadius: 20, shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: { width: 0, height: 0 }, shadowColor: '#000000' }}
      renderCard={(track: SpotifyApi.TrackObjectFull) => {
        return (
          <LinearGradient
            start={{ x: 0, y: 0 }}
            locations={[0.67, 1]}
            colors={cardIndex % 5 !== 0 ? ["#3F3F3F", "#000000"] : ['#3F3F3F', '#000000']}
            className="relative w-full h-full rounded-2xl items-center shadow-lg"
            style={{}}
          >
            {cardIndex % 5 === 0 ?
              <View className="top-3 items-center -mt-1" style={{ backgroundColor: '#7C7C7C', shadowOpacity: 0.5, shadowRadius: 5, shadowOffset: { width: 0, height: 0 }, shadowColor: '#000000', borderRadius: 3, width: 70, height: 18, justifyContent: 'center', alignItems: 'center' }}>
                <Text className="text-center font-semibold tracking-tighter" style={{ fontSize: 10, color: '#FFFFFF', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 5 }}>Sponsored</Text>
              </View>
              : <></>}

            <View className="absolute left-4 right-4 top-8 bottom-0 opacity-100 z-0">

              <View className="flex-1 justify-start items-start">
                <View className="relative justify-center items-center w-full aspect-square justify-start">
                  <Image
                    source={{ uri: track.album.images[0].url }}
                    className="absolute w-full h-full"
                    style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
                  />
                </View>
                <View className="pt-2 px-0 w-full justify-start items-start pt-4">
                  {/* Track Name */}
                  <View className="flex-row items-end">
                    <TextTicker
                      scrollSpeed={speed}
                      loop
                      numberOfLines={2}
                      animationType={"scroll"}
                      easing={Easing.linear}
                      repeatSpacer={25}
                      scroll={false}
                      className="text-white text-4xl font-bold"
                      style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
                    >
                      {track.name}
                    </TextTicker>
                  </View>
                  {/* Artist Name */}
                  <View className="flex-row items-center opacity-80">
                    <FontAwesome5 name="user-alt" size={16} color="white" />
                    <TextTicker
                      scrollSpeed={speed}
                      loop
                      numberOfLines={1}
                      animationType={"scroll"}
                      easing={Easing.linear}
                      repeatSpacer={25}
                      scroll={false}
                      className="px-2 text-white text-xl"
                      style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
                    >
                      {track.artists
                        .map((artist: any) => artist.name)
                        .join(", ")}
                    </TextTicker>
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
                      scroll={false}
                      className="px-2 text-white text-xl"
                      style={{ shadowColor: 'rgba(0, 0, 0, 0.5)', shadowOffset: { width: 0, height: 0 }, shadowRadius: 5 }}
                    >
                      {track.album.name}
                    </TextTicker>
                  </View>
                  {track?.preview_url ? (
                    <View>
                      <View className="flex-row">
                        <Scrubber
                          value={playbackPosition / 1000}
                          onSlidingComplete={(value: number) => {
                            audioPlayer.seek(value * 1000);
                          }}
                          onSlidingStart={() => {
                            //pauseAudio();
                          }}
                          // caused lag
                          // onSlide={(value: number) => {
                          //   setAudioPosition(value * 1000);
                          // }}
                          totalDuration={
                            Math.ceil(playbackDuration / 1000)
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
                              setIsPlaying(!isPlaying);
                              if (!isPlaying) {
                                audioPlayer.pause();
                              } else {
                                audioPlayer.play();
                              }
                            }}
                          >
                            <Ionicons
                              name={
                                !isPlaying
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
        //sound && sound.unloadAsync();
        setPlaybackPosition(0);
        //loadAudio(tracks[cardIndex + 1]);
        audioPlayer.setTrack(tracks[cardIndex + 1]);
        //play();


        console.log(tracks[cardIndex].name + " has preview url?: " + tracks[cardIndex].preview_url);

        // if(cardIndex === tracks.length){
        //   reloadTracks();
        // }
        addTrack();
        //console.log("tracks length: " + tracks.length);
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
