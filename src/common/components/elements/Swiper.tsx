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
  const [recentTracks, setRecentTracks] = React.useState<any[]>([]);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  async function getTracks() { //Fetch tracks to fill cards in homescreen, excluding user's saved songs in Spotify
    if (loaded) {
      return;
    }

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
      limit: 10,
    });


    const tracks = recResponse.tracks;

    await spotify.containsMySavedTracks(
      recResponse.tracks.map((track: any) => track.id)
    ).then(
      // after promise returns of containsMySavedTracks
      function (isSavedArr: any[]) {
        console.log("PROMISE RETURNED" + isSavedArr);
        isSavedArr.forEach((element) => {
          console.log(element);
          if (element === true) {
            console.log("Removing from tracks: " + tracks[isSavedArr.indexOf(element)].name);

            tracks.splice(isSavedArr.indexOf(element), 1);

            console.log("Updated length: " + tracks.length);
          }
        });

      }
    );

    setTracks(tracks);


  }

  async function getRecentlyPlayedTracks() {
    const response = await spotify.getMyRecentlyPlayedTracks();
    const tracks = response.items.map((item: any) => item.track);
    setRecentTracks(tracks);
  }

  async function addToPlaylist(trackURIs : string[]) {
    //console.log("PLAYLIST ID: "+selectedPlaylist);
    const response = await spotify.addTracksToPlaylist(selectedPlaylist, trackURIs);
  }

  React.useEffect(() => {
    getTracks();
  }, []);

  React.useEffect(() => {
    getRecentlyPlayedTracks();
  }, []);

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
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Text className='text-white text-5xl font-bold'>{track.name}</Text>
                  </ScrollView>
                  {/* <Text className='text-white text-2xl px-1 opacity-80'>22</Text> */}
                </View>
                <View className='flex-row items-center opacity-80'>
                  <FontAwesome5 name="user-alt" size={16} color="white" />
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Text className='px-2 text-white text-xl'>{
                      track?.artists?.map((artist: any) => artist.name).join(', ')
                    }</Text>
                  </ScrollView>
                </View>
                <View className='flex-row items-center opacity-80'>
                  <FontAwesome5 name="compact-disc" size={16} color="white" />
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <Text className='px-2 text-white text-xl'>{track?.album?.name}</Text>
                  </ScrollView>
                </View>
                <View className='flex-row'>
                  <Scrubber
                    value={0}
                    onSlidingComplete={(value: number) => console.log(value)}
                    totalDuration={track?.duration_ms / 1000}
                    trackColor={'#666'}
                    scrubbedColor={'#8d309b'}
                  />
                </View>
                <View className='flex-row w-full justify-center content-center items-center'>
                  <AntDesign name="dislike1" size={32} color="white" />
                  <FontAwesome5 name="play" size={32} color="white" />
                  <AntDesign name="like1" size={32} color="white" />

                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      )
    }} onSwipedLeft={ //Add disliked song to the disliked database
      (index: number) => {
        console.log("NOPE: " + tracks[index].name)
        push(ref(database, "SwipedTracks/" + user?.id + "/DislikedTracks/"), {
          trackID: tracks[index].id,
          trackName: tracks[index].name
        })
      }
    } onSwipedRight={ //Add liked songs to the liked database
      (index: number) => {
        console.log("LIKE: " + tracks[index].name)
        push(ref(database, "SwipedTracks/" + user?.id + "/LikedTracks/"), {
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