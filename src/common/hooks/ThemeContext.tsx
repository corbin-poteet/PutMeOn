import { createContext, useContext, useState, useEffect } from 'react';
import themeData from "@screens/ThemesScreen"
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultTheme = themeData[0];

export const ThemeContext = createContext({
  theme: defaultTheme,
  setTheme: (themeId: string) => {},
});



export const ThemeProvider = ({ children }) => {
  const [selectedTheme, setSelectedTheme] = useState(themeData[0]);

  return (
    <ThemeContext.Provider value={{ theme: selectedTheme, setTheme: setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;