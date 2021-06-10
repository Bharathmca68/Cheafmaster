import React, { Component } from 'react'
import failure from "../Assets/failure.gif"
export class Success extends Component {
    render() {
        return (
            <div align="center">
                <img  src={failure} alt="successGif" style={{'width':'60%','height':' fit-content','marginTop':'5%'}}></img>

            </div>
        )
    }
}

export default Success
