import React, { createContext, useContext, useState } from 'react'
import { ResponseType, useAuthRequest } from 'expo-auth-session';
import SpotifyWebApi from 'spotify-web-api-js';

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

  // called when user clicks login button
  const signInWithSpotify = async () => {
    const result = await promptAsync();
    if (result.type === "success") {
      // get access token
      const { access_token } = result.params;

      // set access token and pass to spotify api
      setToken(access_token);
      spotify.setAccessToken(access_token);

      // now we can get user info from the spotify api
      spotify.getMe().then((user) => {
        setUser(user);
      });
    }
  }

  // logout function that can be called from anywhere
  // currently unused
  const logout = () => {
    setToken("");
    setUser({});
    spotify.setAccessToken("");
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