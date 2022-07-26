import React from "react"

export default function Score(props) {
    return (
        <section className="score">
            <p className="score--rolls">Number of rolls: {props.rolls}</p>
            <p className="score--leastRolls">Least rolls: {props.leastRolls}</p>
        </section>
    )    
}