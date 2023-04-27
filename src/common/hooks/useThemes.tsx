import { createContext, useContext, useState } from 'react'

const themeContext = createContext({
   themes: {},
   selectedTheme: "",
   setSelectedTheme: {},
});

//@ts-ignore
export const ThemeProvider = ({children}) => {

   const themeList = {
      default: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      name2: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      name3: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      name4: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      name5: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      name6: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      name7: {
         topGradient: "",
         bottomGradient: "",
         topCard: "",
         bottomCard: "",
         button: "",
         misc: "",
        },
      name8: {
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
      <themeContext.Provider value={{
         themes: themeList,
         selectedTheme: currentTheme,
         setSelectedTheme: setCurrentTheme
      }}>
         {children}
      </themeContext.Provider>
   )
}

export default function useTheme() {
   return useContext(themeContext);
}