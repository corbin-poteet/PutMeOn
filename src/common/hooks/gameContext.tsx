import { createContext } from 'react'

const gameContext = createContext({
    round: 0,
    score: 0,
    earnings: 0,
    setRound: {},
    setScore: {},
    setEarnings: {}
})

export default gameContext;