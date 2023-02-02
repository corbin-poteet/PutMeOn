import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-deck-swiper';


const HomeScreen = () => {

  const navigation = useNavigation();




  const { logout, spotify, user } = useAuth();
  const [userImage, setUserImage] = React.useState<string | null>(null);
  const [tracks, setTracks] = React.useState<any[]>([]);

  // get Elvis' albums, using Promises through Promise, Q or when
  spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    function (data) {
      setTracks(data.items);
    },
    function (err) {
      console.error(err);
    }
  );


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
        <TouchableOpacity className='absolute left-5 top-3'>
          <Image source={{ uri: userImage }} className="w-10 h-10 rounded-full" />
        </TouchableOpacity>
        <TouchableOpacity >
          <Image source={require('../Logo_512.png')} style={{
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
          renderCard={(card?) => {
            return (
              <View key={card?.id} className='justify-center items-center bg-red-500 h-3/4 rounded-xl'>
                <Image source={{ uri: card?.images[0].url }} className="w-64 h-64" />
                <Text className='text-2xl font-semibold'>{card?.name}</Text>
                <Text className='text-xl'>{card?.release_date}</Text>
              </View>
            )
          }}
        />
      </View>



    </SafeAreaView>
  )
}

export default HomeScreen