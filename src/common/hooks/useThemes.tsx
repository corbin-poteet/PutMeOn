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
         topCard: "#512b18",
         bottomCard: "#2a0a03",
         button: "#ff8c00",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Lemon: {
         topGradient: "#f5cc00",
         bottomGradient: "#605000",
         topCard: "#2f6b2e",
         bottomCard: "#184318",
         button: "#2f6b2e",
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
         bottomGradient: "#1c0101",
         topCard: "#210502",
         bottomCard: "#631209",
         button: "#a80707",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Volcano: {
         topGradient: "#e35e40",
         bottomGradient: "#3d0f04",
         topCard: "#4d0000",
         bottomCard: "#750000",
         button: "#750000",
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
      Contrast: {
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
         bottomGradient: "#1541d8",
         topCard: "#1f1f1f",
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
         button: "#1061cc",
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
         logo: "#03e7fb",
         text: "#03e7fb"
      },
      Gilded: {
         topGradient: "#ffb302", 
         bottomGradient: "#7a5e39", 
         topCard: "#aa6c39",  
         bottomCard: "#b8860b", 
         button: "#b8860b",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      Ink: {
         topGradient: "#000000", 
         bottomGradient: "#000000", 
         topCard: "#000000",  
         bottomCard: "#000000", 
         button: "#2f2f2f",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      Null: {
         topGradient: "#000000", 
         bottomGradient: "#000000", 
         topCard: "#0000",  
         bottomCard: "#0000", 
         button: "#0000",
         misc: "",
         logo: "#0000",
         text: "#0000"
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