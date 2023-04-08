import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "@hooks/useAuth";
import { GameProvider } from "@hooks/gameContext";
import StackNavigator from "@components/StackNavigator";
import gameContext from "@hooks/gameContext";
import "./styles";

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <StackNavigator />
        <StatusBar style="auto" />
      </GameProvider>
    </AuthProvider>
  );
}