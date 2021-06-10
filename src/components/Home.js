import React, { Component } from 'react'
import Walpaper from './Walpaper'
import Quicksearches from './Quicksearches'
import  '../styles/Home.css'
// import  axios  from "axios";
import axios from './axios'


class Home extends Component {

    constructor(){
        super();
        this.state={
            locations: [],
            mealtype:[]
        }
    }

    componentDidMount(){
        axios.get('/getalllocation')
            .then(result => {
                this.setState({
                    locations: result.data.locations
                })
            }).catch(error =>{
                console.log(error)
            })

        axios.get('/getmealtype')
            .then(result => {
                this.setState({
                    mealtype: result.data.mealtype
                })
            }).catch(error =>{
                console.log(error)
            })
    }
       

    render() {
        const { locations, mealtype }=this.state
        return (
            <>
               <Walpaper cities= { locations }/>
               <Quicksearches qs= { mealtype }/>
            </>
        )
    }
}
export default Home