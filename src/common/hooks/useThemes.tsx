import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext({
   themes: {},
   selectedTheme: "",
   setSelectedTheme: {},
});

//@ts-ignore
export const ThemeProvider = ({children}) => {

   const themeList = {
      default: {
         topGradient: "#f0f2f4",
         bottomGradient: "#f0f2f4",
         topCard: "#FF0000",
         bottomCard: "#FF0000",
         button: "#7d8490",
         misc: "#FF0000",
         logo: '#01b1f1'
        },
      PMOBlue: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      Carbon: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
         logo: "000000"
        },
      Mango: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      Lemon: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      Sunset: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      Firestone: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      Volcano: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      Legacy: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
   };

   const [currentTheme, setCurrentTheme] = useState<string>("default");

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