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
         text: "#444444"
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
         bottomCard: "#000000",
         button: "#8f34eb",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Firestone: {
         topGradient: "#a80707",
         bottomGradient: "#0d0101",
         topCard: "#210502",
         bottomCard: "#4d0f08",
         button: "#a80707",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Volcano: {
         topGradient: "#e35e40",
         bottomGradient: "#24100b",
         topCard: "#3d0f04",
         bottomCard: "#611908",
         button: "#750000",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
        },
      Channel: {
         topGradient: "#ff7303",
         bottomGradient: "#482000",
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#ff7303",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
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
      Midnight: {
         topGradient: "#000000",
         bottomGradient: "#1541d8",
         topCard: "#1f1f1f",
         bottomCard: "#000000",
         button: "#1f1f1f",
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
      ZABA: {
         topGradient: "#245c5d", 
         bottomGradient: "#432b48", 
         topCard: "#c37d1b",  
         bottomCard: "#7e5112", 
         button: "#c37d1b",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      RAM: {
         topGradient: "#000000", 
         bottomGradient: "#282828", 
         topCard: "#b89900",
         bottomCard: "#625100",
         button: "#808080",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      Ink: {
         topGradient: "#000000", 
         bottomGradient: "#000000", 
         topCard: "#3F3F3F",
         bottomCard: "#3F3F3F",
         button: "#808080",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },
      
      Atlantic: {
         topGradient: "#29527b", 
         bottomGradient: "#08121a", 
         topCard: "#030e14",
         bottomCard: "#07202f",
         button: "#29527b",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },

      Mint: {
         topGradient: "#008080",
         bottomGradient: "#001b1b", 
         topCard: "#3F3F3F",
         bottomCard: "#000000",
         button: "#008080",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF"
      },

      F1: {
         topGradient: "#a80707",
         bottomGradient: "#FFFFFF", 
         topCard: "#2f6b2e",
         bottomCard: "#184318",
         button: "#2f6b2e",
         misc: "",
         logo: "#FFFFFF",
         text: "#FFFFFF",
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