import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";

import "./styles";

export default function App() {
  return (
    <AuthProvider>
      <StackNavigator />
      <StatusBar style="auto" />
    </AuthProvider>

  );
}
