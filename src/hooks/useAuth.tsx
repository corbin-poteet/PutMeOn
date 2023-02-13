import React, { createContext, useContext, useState } from 'react'
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import SpotifyWebApi from 'spotify-web-api-js';
import AsyncStorage from '@react-native-async-storage/async-storage';


// this is the config for the spotify auth request
const config = {
  // the client id is the id of the app we created on spotify's developer dashboard
  clientId: "0876b3cbdd284d49ac26ded9817b6d6d",

  // the scopes are the permissions we want to request from the user
  scopes: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
    "streaming",
    "user-read-email",
    "user-read-private",
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-library-read",
    "user-read-email",
  ],

  // the redirect uri is the uri that spotify will redirect to after the user has logged in
  // currently this is set to localhost, but we will need to change this to the actual uri of the app
  // also we need to add this uri to the list of redirect uris on the spotify developer dashboard
  // also this is the reason authentication doesn't work on the web version of the app currently, need to figure that out
  // TODO: change this so the web version of the app works too
  redirectUri: 'exp://127.0.0.1:19000/',

  // this is the discovery document for spotify's oauth2 api
  discovery: {
    // the authorization endpoint is the url that we will send the user to in order to log in
    authorizationEndpoint:
      "https://accounts.spotify.com/authorize",

    // the token endpoint is the url that we will send the user to in order to get an access token
    tokenEndpoint:
      "https://accounts.spotify.com/api/token",
  }
};


// i think these are like the default values for the AuthContext object we use
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

// this is the actual hook that we use to get the auth context
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState({});
  const [spotify, setSpotify] = useState(new SpotifyWebApi());
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: config.clientId,
      scopes: config.scopes,
      usePKCE: false,
      redirectUri: config.redirectUri,
    },
    config.discovery
  );

  // only re-render if token changes
  React.useMemo(() => ({
    signInWithSpotify,
    token,
    logout,
    spotify,
    user
  }),
    [token]);

  React.useEffect(() => {
    // check if there is a token stored in async storage
    AsyncStorage.getItem('token').then((token) => {
      if (token) {
        // if there is a token, set it and pass it to the spotify api
        setToken(token);
        spotify.setAccessToken(token);
        // now we can get user info from the spotify api
        spotify.getMe().then((user) => {
          setUser(user);
        });
      }
    });
  }, []);

  /**
   * Prompts the user to log in with spotify
   * Called when the user presses the login button
   */
  async function signInWithSpotify() {
    const result = await promptAsync();
    if (result.type === "success") {
      const { access_token } = result.params;
      setAccessToken(access_token);
    }
  }

  /**
   * Sets the access token and saves it to async storage
   * If there is a token, also sets the user info from the spotify api
   * @param token the access token to set
   */
  async function setAccessToken(token: string) {
    setToken(token);
    spotify.setAccessToken(token);
    await AsyncStorage.setItem('token', token);

    if (token) {
      spotify.getMe().then((user) => {
        setUser(user);
      });
    } else {
      setUser({});
    }
  }

  /**
   * Clears the access token and user info
   */
  function clearAccessToken() {
    setAccessToken("");
  }

  /**
   * Clears the access token and user info
   * Called when the user presses the logout button
   */
  function logout() {
    clearAccessToken();
  }

  return (
    <AuthContext.Provider value={{ signInWithSpotify: signInWithSpotify, token: token, logout: logout, spotify: spotify, user: user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}