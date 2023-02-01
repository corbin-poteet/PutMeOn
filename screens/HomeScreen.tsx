import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {

  const navigation = useNavigation();

  


  const { logout, spotify, user } = useAuth();

  return (
    <SafeAreaView>
      <Text>{user?.display_name}</Text>
      



      <Text>I am the Home Screen</Text>
      <Button 
        title="Go to Chat Screen" 
        onPress={() => navigation.navigate('Chat')}
      />
      <Button 
        title="Logout"
        onPress={logout}
      />
    </SafeAreaView>
  )
}

export default HomeScreen