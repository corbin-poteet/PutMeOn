import { StatusBar } from "expo-status-bar";
import React from "react";
import { AuthProvider } from "./src/hooks/useAuth";
import StackNavigator from "./src/StackNavigator";

import "./styles";

export default function App() {
  return (
    <AuthProvider>
      <StackNavigator />
      <StatusBar style="auto" />
    </AuthProvider>

  );
}
