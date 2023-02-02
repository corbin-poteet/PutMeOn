import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native'
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

  spotify.searchTracks('Paramore').then(
    function (data) {
      setTracks(data.tracks.items);
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
          stackSize={3}
          cardIndex={0}
          cardVerticalMargin={80}
          animateCardOpacity
          animateOverlayLabelsOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => { console.log(cardIndex) }}
          onSwipedRight={(cardIndex) => { console.log(cardIndex) }}
          onSwiped={(cardIndex) => { console.log(cardIndex) }}
          onSwipedAll={() => { console.log('onSwipedAll') }}
          
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