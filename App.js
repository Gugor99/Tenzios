import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollsCount, setRollsCount] = React.useState(0)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setIsRunning(false)
            setTenzies(true)
            saveToLocal()
        }
    }, [dice])
    
    function saveToLocal(){
        if(localStorage.getItem("time")){
            localStorage.getItem("time") > time && localStorage.setItem("time", JSON.stringify(time))            
        } else {
            localStorage.setItem("time", JSON.stringify(time))
        }
    }

    function generateNewDie() {
        const randomNum = Math.floor(Math.random() * 6)
        const spellArray = ["one", "two", "three", "four", "five", "six"]
        return {
            value: spellArray[randomNum],
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setIsRunning(true)
            setRollsCount(prevCount => prevCount + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTime(0)
            setRollsCount(0)
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setIsRunning(true)
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {   
                    ...die,
                     isHeld: !die.isHeld 
                } :
                die
        }))
    }
    
    
    const [time, setTime] = React.useState(0)
    const [isRunning, setIsRunning] = React.useState(false)

    React.useEffect(() => {
        let intervalId
        if (isRunning) {
        intervalId = setInterval(() => setTime(time + 1), 10)
                }
            return () => clearInterval(intervalId)
        }, [isRunning, time])

    const minutes = Math.floor((time % 360000) / 6000)
    const seconds = Math.floor((time % 6000) / 100)
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    const string = ((JSON.parse(localStorage.getItem("time")))/100).toFixed(2)
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="bottom-container"> 
                <h2 className="stopwatch-time time">
                    {minutes.toString().padStart(2, "0")}:
                    {seconds.toString().padStart(2, "0")}
                </h2>
                <button 
                    className="roll-dice" 
                    onClick={rollDice}
                >
                    {tenzies ? "New Game" : "Roll"}
                </button>
                <div>
                    <h2 className="cunt">COUNT: <span className="time">{rollsCount}</span></h2>
                </div>
            </div>
            {localStorage.getItem("time") && 
            <p className="relative">BEST TIME: <span className="time">{string}</span>sec</p>}
        </main>
    )
}

