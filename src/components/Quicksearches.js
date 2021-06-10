import React, { Component } from 'react'
import Quickseach from './Quickseach'

class Quicksearches extends Component {
    render() {
        const { qs } =this.props 
        return (
            <>
               
        <div className="container mb-5">
                <h1 className="quicksearch">Quick Searches</h1>
                <h5 className="subtext">Discover restaurants by the meal</h5>

            
              <div className="row">   

                {
                    qs.map((item,index)=>{
                        return <Quickseach key={index} imagesrc={require('../' + item.image).default}  heading={item.name} content={item.content} mealtypeid={item.meal_type} />
                    })
                }
                {/* <Quickseach imagesrc={require('../assets/bf.png').default} heading="Breakfast"/>
                <Quickseach imagesrc={require('../assets/lunch.png').default} heading="Lunch"/>
                <Quickseach imagesrc={require('../assets/dinner.png').default} heading="Dinner"/>
                <Quickseach imagesrc={require('../assets/Drinks.png').default} heading="Drinks"/>
                <Quickseach imagesrc={require('../assets/Snacks.png').default} heading="Sancks"/>
                <Quickseach imagesrc={require('../assets/Nightparty.png').default} heading="Nightparty"/> */}
            </div>      
        </div>
            </>
        )
    }
}
export default Quicksearches