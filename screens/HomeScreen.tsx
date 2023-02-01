import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';


const HomeScreen = () => {

  const navigation = useNavigation();




  const { logout, spotify, user } = useAuth();
  const [userImage, setUserImage] = React.useState<string | null>(null);

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
    <SafeAreaView>
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
    </SafeAreaView>
  )
}

export default HomeScreen