import { View, Text } from 'react-native'
import React, { createContext, useContext } from 'react'
import * as WebBrowser from 'expo-web-browser';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {

    const signInWithSpotify = async () => {
        try {
            const result = await WebBrowser.openAuthSessionAsync(
                'https://accounts.spotify.com/authorize?client_id=2c2d3b2e2d3b2e2d3b2e2d3b2e2d3b2e&response_type=code&redirect_uri=https://www.google.com/&scope=user-read-private%20user-read-email&state=34fFs29kd09',
                'https://localhost:19000'
            );
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
    return useContext(AuthContext);
}