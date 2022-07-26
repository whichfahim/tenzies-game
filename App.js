import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import Score from "./Score"

export default function App() {
    
    React.useEffect( ()=> {
        // window.localStorage.removeItem("leastRolls")
        //on first render, set localstorage item "leastRolls" to Number(99)
        window.localStorage.setItem("leastRolls", JSON.stringify(99)) 
        
        // console.log(typeof JSON.parse(localStorage.getItem("leastRolls")))
    },[])
    
    const [leastRolls, setLeastRolls] = React.useState(JSON.parse(window.localStorage.getItem("leastRolls")))
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollsCount, setRollsCount] = React.useState(0)
    
     React.useEffect( ()=> {
        //console.log(leastRolls)
        window.localStorage.setItem("leastRolls", JSON.stringify(leastRolls))
    }, [leastRolls])
    
    console.log(`localStorage val = ${JSON.parse(window.localStorage.getItem("leastRolls"))}`)
    // console.log(leastRolls)
    console.log(`leastRolls = ${leastRolls}`)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
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
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollsCount(rollsCount => rollsCount += 1)  
            // rollsCount += 1          
        } else {
            if (rollsCount < leastRolls){
                setLeastRolls(rollsCount)
                //console.log(window.localStorage.getItem("leastRolls"))
                //console.log(leastRolls)
            }
            setRollsCount(0)
            setDice(allNewDice())
            

            setTenzies(false)             
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
     

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <Score 
                rolls={rollsCount}
                leastRolls={leastRolls}/>
        </main>
    )
}