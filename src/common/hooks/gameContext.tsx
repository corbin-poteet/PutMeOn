import React, { createContext } from 'react'
import { round } from 'react-native-reanimated'

const gameContext = createContext({
    round: 0,
    score: 0,
    earnings: 0,
    setRound: {},
    setScore: {},
    setEarnings: {}
})

export const GameProvider = ({children}) => { //ignore stupid warning, it works

    return (
        <gameContext.Provider value={{ round: 69, score: 69, earnings: 69, setRound: () => {}, setScore: () => {}, setEarnings: () => {}}}>
            {children}
        </gameContext.Provider>
    )
}

export default gameContext;