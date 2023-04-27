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
         text: "#5A5A5A"
        },
      Classic: {
         topGradient: "#014871",
         bottomGradient: "#A0EBCF",
         topCard: "#183454",
         bottomCard: "#071c2a",
         button: "#014871",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
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
         topCard: "#111",
         bottomCard: "#3F3F3F",
         button: "#333",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Mango: {
         topGradient: "#ff8c00",
         bottomGradient: "#4b941b",
         topCard: "#e35e40",
         bottomCard: "#3d0f04",
         button: "#ff8c00",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Lemon: {
         topGradient: "#f5cc00",
         bottomGradient: "#2f6b2e",
         topCard: "#aa6c39",
         bottomCard: "#aa6c39",
         button: "#f5cc00",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Sunset: {
         topGradient: "#8f34eb",
         bottomGradient: "#eb7434",
         topCard: "#3F3F3F",
         bottomCard: "#111",
         button: "#8f34eb",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Firestone: {
         topGradient: "#a80707",
         bottomGradient: "#210502",
         topCard: "#3d0000",
         bottomCard: "#a80707",
         button: "#a80707",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Volcano: {
         topGradient: "#e35e40",
         bottomGradient: "#3d0f04",
         topCard: "#3F3F3F",
         bottomCard: "#6f2e2d",
         button: "",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Legacy: {
         topGradient: "#696969",
         bottomGradient: "#696969",
         topCard: "#3F3F3F",
         bottomCard: "#3F3F3F",
         button: "#82f252",
         misc: "",
         logo: "#82f252",
         text: "#82f252"
        },
      Highcon: {
         topGradient: "#000000",
         bottomGradient: "#000000",
         topCard: "#000000",
         bottomCard: "#000000",
         button: "#0000ff",
         misc: "",
         logo: "#0000ff",
         text: "#FFFFFF"
      },
      Midnight: {
         topGradient: "#000000",
         bottomGradient: "#000032",
         topCard: "#2f2f2f",
         bottomCard: "#121212",
         button: "#2f2f2f",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      Spectre: {
         topGradient: "#5b9a48", 
         bottomGradient: "#1a3c0f", 
         topCard: "#000000", 
         bottomCard: "#0000", //Nick here, I found that leaving an incomplete hex value for the bottom gradient makes it transparent
         button: "#5b9a48",
         misc: "",
         logo: "#5b9a48",
         text: "#FFFFFF"
      },
      Desktop: {
         topGradient: "#8dbcf4", 
         bottomGradient: "#6e9123", 
         topCard: "#1061cc", 
         bottomCard: "#3e8ae8", 
         button: "#198e19",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      Kokomo: {
         topGradient: "#7f2118", 
         bottomGradient: "#ab7d4a", 
         topCard: "#64155b", 
         bottomCard: "#0a0433", 
         button: "#0a0433",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      Retro: {
         topGradient: "#0f011a", 
         bottomGradient: "#1e146e", 
         topCard: "#64155b", 
         bottomCard: "#0a0433", 
         button: "#f900f5",
         misc: "",
         logo: "#fcb906",
         text: "#03e7fb"
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