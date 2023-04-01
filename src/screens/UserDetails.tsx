import { View, Text, TouchableOpacity, } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core';
import useAuth from '@hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';


const UserDetails = () => { //Display User information
    
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true,
          headerTitle: 'User Information',         
        });
      }, [navigation]);

    return (
      <LinearGradient start={{ x: -0.5, y: 0 }} colors={['#014871', '#A0EBCF']} style={{ flex: 1, justifyContent: 'flex-start' }}>
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 30, color: 'white' }}>Account Name: {user?.display_name}</Text>
          <Text style={{ fontSize: 30, color: 'white' }}>Country: {user?.country}</Text>
          <Text style={{ fontSize: 30, color: 'white' }}>Email: {user?.email}</Text>
          <Text style={{ fontSize: 30, color: 'white' }}>Subscription Type: {user?.product}</Text>
        </View>
        <View style={{ alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
        <TouchableOpacity style={{ backgroundColor: 'red', width: '60%', height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 10, marginBottom: 50 }} onPress={logout}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Logout</Text>
        </TouchableOpacity>
      </View>
      </LinearGradient>
    );
}
  

export default UserDetails