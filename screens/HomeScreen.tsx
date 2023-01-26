import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {

  const navigation = useNavigation();

  return (
    <View>
      <Text>I am the Home Screen</Text>
      <Button 
        title="Login" 
        onPress={() => navigation.navigate('Chat')}
      />
    </View>
  )
}

export default HomeScreen