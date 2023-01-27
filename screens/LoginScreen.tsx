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

  const [token, setToken] = useState("");
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: '0876b3cbdd284d49ac26ded9817b6d6d',
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      usePKCE: false,
      redirectUri: 'exp://127.0.0.1:19000/',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      setToken(access_token);
    }
  }, [response]);


  return (
    <View>
      <Text>Login to Spotify</Text>
      <Button title="Login" onPress={() => { promptAsync(); }} />
      {token && <Text>{token}</Text>}
    </View>
  )
}

export default LoginScreen