import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { AuthProvider } from "@hooks/useAuth";
import { GameProvider } from "@hooks/gameContext";
import gameContext from "@hooks/gameContext";
import StackNavigator from "@components/StackNavigator";
import "./styles";


export default function App({children}) {

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [earnings, setEarnings] = useState(0);

  return (
    <AuthProvider>
      <gameContext.Provider value = {{round, setRound, score, setScore, earnings, setEarnings}}>
        <StackNavigator />
        <StatusBar style="auto" />
      </gameContext.Provider>
    </AuthProvider>
  );
}