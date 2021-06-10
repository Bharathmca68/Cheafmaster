import React, { Component } from 'react'
import successpage from "../Assets/successpage.gif"


export class Success extends Component {

    render() {
        return (
            <>
                
                <img src={successpage} alt="successGif" style={{'width':'100%','height':'80%'}}></img>

            </>
        )
    }
}

export default Success
