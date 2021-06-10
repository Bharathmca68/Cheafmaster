import React, { Component } from 'react'
// import axios from "axios";
import axios from './axios'
import '../styles/walpapers.css'
import { withRouter } from 'react-router';


class Walpaper extends Component {

    constructor(){
        super()
        this.state={
            text : '',
            restaurants : [],
            suggestions : []
        }
    }
    
    onoptionchange(event){
      const c_id_c_name = event.target.value
      const c_id = c_id_c_name.split('_')[0];
      const c_name = c_id_c_name.split('_')[1];
        localStorage.setItem("city_id",c_id)


        //fetch the Restaurants from city_name
        axios.get(`/getrestaurantbycity/${c_name}`)
        .then(result => {
            this.setState({
                restaurants : result.data.restaurant
            })
        })
        .catch(error => {
            console.log(error)
        })

    }

    onTextChange = (event) =>{
        const textSearch = event.target.value
        const { restaurants } = this.state
        let suggestions = [];

        if (textSearch.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(textSearch.toLowerCase()))
        }
        this.setState({
            text : textSearch,
            suggestions : suggestions
        })
    }

    GotoRestaurant = (item) =>{
        this.props.history.push(`/details?restaurantID=${item._id}`)
    }


    rendersuggestions () {
        const { suggestions } =this.state
        if(suggestions == 0){
            return null
        }
       return (
            <ul className="suggestionsBox">
                {
                    suggestions.map((item,index)=>{
                       return (
                          
                            <li key={index} onClick={()=> this.GotoRestaurant(item)}>
                                <div className='suggestionimage'>
                                    <img src={require('../'+ item.image).default} alt='notFound'/>
                                    </div>
                                    <div className='suggestioninfo' align='left'> 
                                        <div>
                                            {item.name} ,{item.locality}   
                                        </div>
                                    <div align='left' className='text-muted'>
                                        Rating : {item.aggregate_rating} ,{item.city}
                                        <span className="text-danger float-end">
                                            Order now &#8594;
                                        </span>
                                    </div>
                                       
                                </div>

                            </li>
                           
                            )
                    })
                }       
            </ul>
        );   
    }

    render() {
        const { cities } =this.props
        return (
            <>
                <div className="imagess"></div>
                <div className="imagetext">
                    <div className="logo">
                        <i className="fa fa-cutlery " aria-hidden="true"></i>
                    </div>
                    <div className="textheading row-12">
                    Find the best restaurants, cafés, and bars
                    </div>
                </div> 
        
        
               

                
                <div className="loc row">
                    <div className="col-12 col-6">
                        <select  id="location" onChange={(event) => this.onoptionchange(event)}>
                            <option defaultValue='0' disabled selected>Please select a location</option>
                            
                            {
                                cities.map((item, index)=>{
                                    return <option key={index} value={item.city_id + '_' + item.city} >{item.name},{item.city}</option>
                                })
                            }

                            {/* <option>Anekal</option>
                            <option>Attibele</option>
                            <option>Sarjapura</option>
                            <option>E-city</option>
                            <option>Chandapura</option> */}
                            
                        </select>
                        <input type="text" placeholder="Search for restuarants" className="searchinput" size="30" onChange={this.onTextChange}/>
                       {
                           this.rendersuggestions()
                       }
                    </div>
                </div>

            </>
        )
    }
}
export default withRouter(Walpaper);