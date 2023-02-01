import { View, Text } from 'react-native'
import React, { createContext, useContext, useState } from 'react'
import * as WebBrowser from 'expo-web-browser';
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import SpotifyWebApi from 'spotify-web-api-js';

const discovery = {
  authorizationEndpoint:
    "https://accounts.spotify.com/authorize",
  tokenEndpoint:
    "https://accounts.spotify.com/api/token",
};



const AuthContext = createContext({
  signInWithSpotify: () => {
    return new Promise((resolve, reject) => {
      resolve(null);
    });
  },

  token: "",

  logout: () => { },

  spotify: new SpotifyWebApi(),

  user: null,





});

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [spotify, setSpotify] = useState(new SpotifyWebApi());
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

  const signInWithSpotify = async () => {
    const result = await promptAsync();
    if (result.type === "success") {
      const { access_token } = result.params;
      console.log("access_token", access_token);
      setToken(access_token);
      spotify.setAccessToken(access_token);
      setSpotify(spotify);
      spotify.getMe().then((user) => {
        console.log("user", user);
        setUser(user);
      });

      return access_token;
    } else {
      return null;
    }
  }

  const logout = () => {
    setToken("");
  }

  // only re-render if token changes
  const memoizedValue = React.useMemo(() => ({
    signInWithSpotify,
    token,
    logout,
    spotify,
    user
  }),
    [token]);

  return (
    <AuthContext.Provider value={{ signInWithSpotify: signInWithSpotify, token: token, logout: logout, spotify: spotify, user: user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}