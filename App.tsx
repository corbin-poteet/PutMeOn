import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { AuthProvider } from "@hooks/useAuth";
import gameContext from "@hooks/gameContext";
import StackNavigator from "@components/StackNavigator";
import "./styles";
import { AudioPlayerProvider } from "@/common/hooks/useAudioPlayer";
import { DeckManagerProvider } from "@/common/hooks/useDeckManager";
import { ThemeProvider } from "@/common/hooks/useThemes";

//@ts-ignore
export default function App({ children }) {

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>("");

  return (
    <AuthProvider>
      <ThemeProvider>
        <DeckManagerProvider>
          <AudioPlayerProvider>
            <gameContext.Provider value={{ round, setRound, score, setScore, earnings, setEarnings, selectedPlaylist, setSelectedPlaylist }}>
              <StackNavigator />
              <StatusBar style="auto" />
            </gameContext.Provider>
          </AudioPlayerProvider>
        </DeckManagerProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}