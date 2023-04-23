import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { AntDesign, Entypo, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsSwitch from '@/common/components/SettingsSwitch';
import SettingsButton from '@/common/components/SettingsButton';
import { FontAwesome5 } from '@expo/vector-icons';

//Settings tab

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

  React.useEffect(() => { //Load user image
    if (user) {
      if (user.images) {
        if (user.images.length > 0) {
          setUserImage(user.images[0].url)
        }
      }
    }
  }, [user]);

  return (
    //Logout button functionality, user details
    <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
      <SafeAreaView className='flex-1 bg-white' edges={['top']}>

        {/* Header */}
        <View className='items-start bg-white w-full px-4'>
          <View className='flex-row items-center w-full'>
            <Image source={require('@assets/Logo_512_White.png')} style={{
              width: 128,
              height: 65,
              resizeMode: 'contain',
              tintColor: '#01b1f1'
            }} />

            {/* Settings Button (but it's just an icon, button functionality removed)*/}
            <TouchableOpacity className='ml-auto' activeOpacity={1} onPress={() => { }}> 
              <FontAwesome5 name="cog" size={36} color="#7d8490" />
            </TouchableOpacity>

          </View>
        </View>

        <ScrollView className='flex-1 bg-white' >


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
                <Text className='text-3xl'>{user?.display_name}</Text>
              </View>
            </View>
          </View>

          {/* Account Settings */}
          <View className='flex-1 items-start py-5' style={{ backgroundColor: '#f0f2f4' }}>
            <Text className='text-base font-bold px-5 py-3 uppercase tracking-tight' style={{ color: '#515864' }}>Discovery Settings</Text>
            <SettingsSwitch text='Filter Explicit' value={true} />
            <SettingsSwitch text='Opt in to PME Telemetry' />
            
            <Text className='text-base font-bold px-5 py-3 uppercase tracking-tight' style={{ color: '#515864' }}>Preferences</Text>
            <SettingsButton text='Decks' navigateString='Decks'/>
            <SettingsButton text='Themes' navigateString='Home'/>
            
            <Text className='text-base font-bold px-5 py-3 uppercase tracking-tight' style={{ color: '#515864' }}>Information</Text>
            <SettingsButton text='User Information' navigateString='UserInfo'/>
            <SettingsButton text='Put Me On Information' navigateString='AppInfo'/>
            
          </View>
        </ScrollView>

      </SafeAreaView>
    </LinearGradient >
  )


}

export default SettingsScreen