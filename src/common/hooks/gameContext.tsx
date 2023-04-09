import React, { createContext, useContext, useState } from 'react'

const gameContext = createContext({
    round: 0,
    score: 0,
    earnings: 0,
    setRound: () => {},
    setScore: () => {},
    setEarnings: () => {}
})

export const GameProvider = ({children}) => {

    return (
        <gameContext.Provider value={{ round: 69, score: 69, earnings: 69, }}>
            {children}
        </gameContext.Provider>
    )
}

export default function useGameContext() {
    return useContext(gameContext)
}