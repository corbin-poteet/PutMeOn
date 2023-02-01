import { View, Text, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import { ResponseType, useAuthRequest } from "expo-auth-session";

const discovery = {
  authorizationEndpoint: 
  "https://accounts.spotify.com/authorize",
  tokenEndpoint: 
  "https://accounts.spotify.com/api/token",
};

const LoginScreen = () => {

 

  const { token, signInWithSpotify } = useAuth();


  return (
    <View>
      <Text>Login to Spotify</Text>
      <Button title="Login" onPress={signInWithSpotify} />
      {token && <Text>{token}</Text>}
    </View>
  )
}

export default LoginScreen