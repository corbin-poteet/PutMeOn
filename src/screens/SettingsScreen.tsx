import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Switch } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


const SettingsScreen = () => {

  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [userImage, setUserImage] = React.useState<string | null>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTitle: 'Settings',
      //TODO: Figure out how to make this swipe from the left

    });
  }, [navigation]);

  React.useEffect(() => {
    if (user) {
      if (user.images) {
        if (user.images.length > 0) {
          setUserImage(user.images[0].url)
        }
      }
    }
  }, [user]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      paddingVertical: 15,
      paddingHorizontal: 15,
      marginBottom: 8,
      width: '100%',
    },
    button: {
      backgroundColor: 'Green', 
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
  
  return (
    //Logout button functionality, user details
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <SafeAreaView className='flex-1 bg-white' edges={['top']}>

        {/* Header */}
        <View className='items-start bg-white'>
          <View>
            <Image source={require('@assets/Logo_512_White.png')} style={{
              width: 128,
              height: 65,
              transform: [{ translateX: 16 }],
              resizeMode: 'contain',
              tintColor: '#01b1f1'
            }} />
          </View>
        </View>

        {/* User Info */}
        <View className='flex-1 bg-white items-center py-3'>
          <View>
            {
              userImage !== null
                ?
                <View className='rounded-full' style={{ borderWidth: 6, borderColor: '#01b1f1' }}>
                  <Image source={{ uri: userImage }} className="w-48 h-48 rounded-full" style={{ borderWidth: 4, borderColor: 'white' }} />
                </View>

                :
                <View>
                  <Image source={require('@assets/blank_user.png')} className="w-10 h-10 rounded-full" style={{ borderWidth: 2, borderColor: 'blue' }} />
                </View>
            }

            <View className='flex-1 items-center py-4'>
              <Text className='text-3xl' >{user?.display_name}</Text>
            </View>
          </View>
        </View>

        <View className='flex-1 items-start py-5 my-1 ' style={{ backgroundColor: '#f0f2f4' }}>
          <Text className='text-base font-bold px-5 py-3 uppercase tracking-tight' style={{ color: '#515864' }}>Discovery Settings</Text>

          <View className='flex-row w-full items-center py-3 mb-0.5 bg-white px-5'>
            <Text className='text-base'>Filter Explicit Content</Text>
            <Switch
              onValueChange={null}
              value={true}
              className='ml-auto'
            />
          </View>

          <View className='flex-row w-full items-center py-3 bg-white px-5 mb-0.5'>
            <Text className='text-base'>Filter No Previews</Text>
            <Switch
              onValueChange={null}
              value={true}
              className='ml-auto'
            />
          </View>

          <View className='flex-row w-full items-center py-3 bg-white px-5 mb-0.5'>
            <Text className='text-base'>Your Mom</Text>
            <Switch
              onValueChange={null}
              value={true}
              className='ml-auto'
              
            />
          </View>
          <View className='flex-row w-full items-center py-3 bg-white px-5 mb-0.5'>
            <Button
              title="Themes"
              onPress={() => navigation.navigate('Themes')}
              className= 'ml-auto'
            />
            {/* Add other settings options here */}
          </View>

        </View>



        {/* <View style={{ alignItems: 'left' }}>
          <TouchableOpacity onPress={
            () => {
              // @ts-ignore
              navigation.navigate('UserInfo')
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30, marginBottom: 10 }}>
              <Ionicons style={{ marginRight: 12, marginLeft: 10, }} name="person-circle-outline" size={30} color="white" />
              <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white' }}>Account</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={
            () => {
              // @ts-ignore
              navigation.navigate('Playlist')
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
              <MaterialIcons style={{ marginRight: 12, marginLeft: 10 }} name="playlist-add-check" size={35} color="white" />
              <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Playlists</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
              <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="brush-outline" size={35} color="white" />
              <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Themes</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
              <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="play-circle" size={35} color="white" />
              <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Playback</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={
            () => {
              // @ts-ignore
              navigation.navigate('AppInfo')
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
              <Ionicons style={{ marginRight: 12, marginLeft: 10 }} name="information-circle-outline" size={35} color="white" />
              <Text style={{ fontWeight: 'bold', fontSize: 30, color: 'white', }}>Information</Text>
            </View>
          </TouchableOpacity>
        </View> */}



      </SafeAreaView>
    </LinearGradient>
  )


}

export default SettingsScreen