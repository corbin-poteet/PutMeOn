import { View, Text, Image, Slider, ScrollView } from 'react-native'
import React from 'react'
import useAuth from '@/common/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import CardsSwipe from 'react-native-cards-swipe';
import { FontAwesome5 } from '@expo/vector-icons';
import database from "../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import { push, ref, set, child, update } from 'firebase/database';
import Scrubber from 'react-native-scrubber'
import { AntDesign } from '@expo/vector-icons'; 
import { selectedPlaylist } from '@screens/PlaylistScreen';


type Props = {
  tracks: any[];
};

const Swiper = (props: Props) => {

  const { spotify, user } = useAuth();
  const [tracks, setTracks] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [needsReload, setReload] = React.useState<boolean>(false);
  const [deckCounter, setDeckCounter] = React.useState<number>(0);

  let trackStack: any[] = [];

  //previously known as getTracks
  async function initializeTracks() {

    const topArtistsIds = await spotify.getMyTopArtists({ limit: 5 }).then(
      function (data: { items: any[]; }) {
        return data.items.map((artist: any) => artist.id);
      },
      function (err: any) {
        console.error(err);
      }
    ) as string[];

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
      );

      trackStack = recResponse.tracks;
      setTracks(recResponse.tracks);
      setDeckCounter(recResponse.tracks.length);
    
  }

  async function updateTracks() {

    let trackStack = tracks;
    console.log("trackstack beginning of function: " + trackStack.length);
    console.log("tracks usestate beginning of function: " + tracks.length);


    const topArtistsIds = await spotify.getMyTopArtists({ limit: 5 }).then(
      function (data) {
        return data.items.map((artist: any) => artist.id);
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
    trackStack = trackStack.concat(recResponse.tracks);
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
          console.log(err);
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


  async function addToPlaylist(trackURIs : string[]) {
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
    if (needsReload) {
      updateTracks();
      setReload(false);
    }
  }, [needsReload]);

  if (tracks.length === 0) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }


  return (
    <CardsSwipe cards={tracks} renderCard={(track: any) => {
      return (
        <LinearGradient start={{ x: 0, y: 0 }} locations={[0.67]} colors={['#3F3F3F', 'rgba(1,1,1,1)']} className="relative w-full h-full rounded-2xl" >
          <View className='absolute left-4 right-4 top-8 bottom-0 opacity-100 z-0'>
            <View className='flex-1 justify-start items-start'>
              <View className='relative justify-center items-center w-full aspect-square justify-start'>
                <Image source={{ uri: track?.album?.images[0].url }} className='absolute w-full h-full' />
              </View>
              <View className='py-2 px-0 w-full justify-start items-start pt-4'>
                <View className='flex-row items-end'>
                  <Text className='text-white text-5xl font-bold'>{track?.name}</Text>
                  {/* <Text className='text-white text-2xl px-1 opacity-80'>22</Text> */}
                </View>
                <View className='flex-row items-center opacity-80'>
                  <FontAwesome5 name="user-alt" size={16} color="white" />
                  <Text className='px-2 text-white text-xl'>{
                    track?.artists?.map((artist: any) => artist.name).join(', ')
                  }</Text>
                </View>
                <View className='flex-row items-center opacity-80'>
                  <FontAwesome5 name="compact-disc" size={16} color="white" />
                  <Text className='px-2 text-white text-xl'>{track?.album?.name}</Text>
                </View>
                <View className='flex-row'>
                  <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
                  />
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      )
    }}onSwipedLeft = { //Add disliked song to the disliked database
      (index: number) => {
        setDeckCounter(deckCounter-1);
        console.log("DECK COUNTER: "+deckCounter)
        if (deckCounter <= 5 && needsReload === false) {
          setReload(true);
        }

        console.log("NOPE: "+tracks[index].name)
        push(ref(database, "SwipedTracks/"+user?.id+"/DislikedTracks/"),{
          trackID: tracks[index].id,
          trackName: tracks[index].name
        })
      } 
    } onSwipedRight = { //Add liked songs to the liked database
      (index: number) => {
        setDeckCounter(deckCounter-1);
        console.log("DECK COUNTER: "+deckCounter)
        if (deckCounter <= 5 && needsReload === false) {
          setReload(true);
        }

        console.log("LIKE: "+tracks[index].name)
        push(ref(database, "SwipedTracks/"+user?.id+"/LikedTracks/"),{
          trackID: tracks[index].id, 
          trackName: tracks[index].name
        })
        console.log("Playlist to add to: "+selectedPlaylist?.name)
        const likedTrack : string[] = []
        likedTrack.push(tracks[index].uri)
        addToPlaylist(likedTrack)
      }
    } />   
  )
}

export default Swiper