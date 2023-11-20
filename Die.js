import React from "react"

export default function Die(props) {
    const styles = {
        boxShadow: props.isHeld ? "0px 0px 12px yellow" : ""
    }
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            <div className="die-background">
                <img src={`./images/dice-six-faces-${props.value}.png`}/>
            </div>
        </div>
    )
}

