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
    });
  }, [navigation]);

  return (
    <View>
      <Button title="Logout" onPress={logout} color="red" />
    </View>
  )
}

export default UserScreen