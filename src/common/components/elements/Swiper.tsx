import { View, Text, Image, Slider } from 'react-native'
import React from 'react'
import useAuth from '@/common/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import CardsSwipe from 'react-native-cards-swipe';
import { FontAwesome5 } from '@expo/vector-icons';
import database from "../../../../firebaseConfig.tsx"; //ignore this error the interpreter is being stupid it works fine
import {push, ref, set, child, update} from 'firebase/database';

type Props = {
  tracks: any[];
};

const Swiper = (props: Props) => {

  const { spotify, user } = useAuth();
  const [tracks, setTracks] = React.useState<any[]>([]);

  async function getTracks() {
    const response = await spotify.getMyRecentlyPlayedTracks();
    const tracks = response.items.map((item: any) => item.track);
    setTracks(tracks);
  }

  React.useEffect(() => {
    getTracks();
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
                  <Text className='text-white text-5xl font-bold'>{track.name}</Text>
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
        //set(ref(database, "SwipedTracks/"+user?.id+"/DislikedTracks/"),{
        //  trackName: tracks[index].name //Replace this with track ID in the future
        //});
        push(ref(database, "SwipedTracks/"+user?.id+"/DislikedTracks/"),{
          trackName: tracks[index].name //Replace this with track ID in the future
        })
      } 
    } onSwipedRight = { //Add liked songs to the liked database
      (index: number) => {
        //set(ref(database, "SwipedTracks/"+user?.id+"/LikedTracks/"),{
        //  trackName: tracks[index].name //Replace this with track ID in the future
        //});
        push(ref(database, "SwipedTracks/"+user?.id+"/LikedTracks/"),{
          trackName: tracks[index].name //Replace this with track ID in the future
        })
      } 
    }/>
  )
}

export default Swiper