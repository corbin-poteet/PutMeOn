import { View, Text, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '../hooks/useAuth';


const UserScreen = () => {

  const navigation = useNavigation();
  const { user, logout } = useAuth();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: user?.display_name || 'User',
      //TODO: Figure out how to make this swipe from the left
      
    });
  }, [navigation]);

  return (
    <View>
      <View>
        <Button title="Logout" onPress={logout} color="red" />
      </View>
      <View>
        <Text>Display Name: {[user.display_name]}</Text>
        <Text>Country: {user.country}</Text>
        <Text>Email: {user.email}</Text>
        <Text>Subscription Type: {user.product}</Text>
      </View>
    </View>
    
  )
}

export default UserScreen