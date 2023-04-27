import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext({
   themes: {},
   selectedTheme: "",
   setSelectedTheme: {},
});

//@ts-ignore
export const ThemeProvider = ({children}) => {

   //List of all themes for app with color codes
   const themeList = {
      Default: {
         topGradient: "#f0f2f4",
         bottomGradient: "#f0f2f4",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#01b1f1",
         misc: "",
         logo: "#01b1f1",
         text: "#000000"
        },
      PMOBlue: {
         topGradient: "#abc7f7",
         bottomGradient: "#005eff",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#abc7f7",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Carbon: {
         topGradient: "#333",
         bottomGradient: "#111",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#333",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Mango: {
         topGradient: "#ff8c00",
         bottomGradient: "#4b941b",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#ff8c00",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Lemon: {
         topGradient: "#f5cc00",
         bottomGradient: "#2f6b2e",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#f5cc00",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Sunset: {
         topGradient: "#8f34eb",
         bottomGradient: "#eb7434",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#8f34eb",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Firestone: {
         topGradient: "#a80707",
         bottomGradient: "#210502",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#a80707",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Volcano: {
         topGradient: "#e35e40",
         bottomGradient: "#3d0f04",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Legacy: {
         topGradient: "#696969",
         bottomGradient: "#696969",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#696969",
         misc: "",
         logo: "#82f252",
         text: "#FFFFFF"
        },
   };

   const [currentTheme, setCurrentTheme] = useState<string>("Default");

   return(
      <ThemeContext.Provider value={{
         themes: themeList,
         selectedTheme: currentTheme,
         setSelectedTheme: setCurrentTheme
      }}>
         {children}
      </ThemeContext.Provider>
   )
}

export default function useTheme() {
   return useContext(ThemeContext);
}