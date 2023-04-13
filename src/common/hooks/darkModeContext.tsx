import { createContext } from 'react'

const darkModeContext = createContext({
    backgroundColor: '#000000',
    headerColor: '#000000',
    setBackgroundColor: {},
    setHeaderColor: {}
})

export default darkModeContext;