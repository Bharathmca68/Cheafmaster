import React, { Component } from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Modal from 'react-modal'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
// import  axios  from "axios";
import axios from "./axios";


import CancelIcon from '@material-ui/icons/Cancel';
import Spinner from '../Assets/Spinner.gif';

//rating
import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';


import queryString from 'query-string';
import '../styles/details.css';


//header import for email


//  const customstyles ={

//         width: '10vh',
//         height: '10vh',
//         backgroundcolor: '#192f60',
//         top: "10px",
//         zindex: '100',
//         borderradius: '10%',
//         color: 'white',
//         paddingleft: '34px',
//         paddingtop: '25px'

//  }

class Details extends Component {

    constructor() {
        super()
        this.state = {
            restaurants: undefined,
            isMenumodalOpen: false,
            Menu: [],
            total_price: 0,
            dish_name: [],
            isLoggedIn: false,
            qty: 0,
            user_mail : ""
        }
    }
    componentDidMount() {

        debugger
        //getting user 
        let user_mail = localStorage.getItem("temp_user");
        const isLoggedIn = localStorage.getItem("isLoggedIn");
       
        
        //get the restaurant id from query params
        const qString = queryString.parse(this.props.location.search);
        const { restaurantID } = qString;

        //make an API call to get the restaurant details for the given id
        
        axios.get(`/restaurant/${restaurantID}`)
            .then(result => {
                this.setState({
                    restaurants: result.data.restaurant[0],
                    user_mail : user_mail, //setting user mail for payment
                    isLoggedIn : isLoggedIn
                })
            }).catch(error => {
                console.log(error)
            })


        axios.get(`/getmenu/${restaurantID}`)
            .then(result => {
                this.setState({
                    Menu: result.data.menu
                })
            }).catch(error => {
                console.log(error)
            })
    }


    //rating function

    useStyles = makeStyles((theme) => ({
        display: 'flex',
        flexDirection: 'column',
        '& > * + *': {
            marginTop: theme.spacing(1),
        },
    }));



    handleMenu = () => {

        if (this.state.isLoggedIn == null) {
            alert("Please login")
        } else {
            this.setState({
                isMenumodalOpen: true
            })
        }
    }

    closeModal = () => {
        this.setState({
            isMenumodalOpen: false
        })
    }
    add_items = (item, event) => {

        const itemName = item.itemName;

        const { total_price, dish_name } = this.state;
        const itemCount = this.state[itemName] || 0;
        this.setState({
            // count :event.target.value +  1,
            // count: count + 1,

            dish_name: dish_name +"-"+itemName,
            total_price: total_price + item.itemPrice,
            [itemName]: itemCount + 1,
            // qty: itemCount
        })
    }

    remove_items = (item, e) => {
        const itemName = item.itemName;
        const itemCount = this.state[itemName] || 0;
        const { total_price } = this.state
        if (total_price == 0) {
            alert('total price is zero')
        } else {
            this.setState({

                total_price: total_price - item.itemPrice,
                [itemName]: itemCount - 1,
                // qty: itemCount
            })
        }
    }


    /////////// payment integrations  

    isObj = (val) => {
        return typeof val === 'object'
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value
        }

    }

    buildform = (details) => {
        const { action, params } = details

        const form = document.createElement('form')
        form.setAttribute('method', 'post');
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {

            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        });
        return form;

    }

    postTheinfo = (details) => {
        const form = this.buildform(details)
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    getCheckSum = (data) => {

        return fetch('https://gentle-wave-50371.herokuapp.com/payment', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        }).then(result => {
            return result.json()
        }).catch(error => {
            console.log(error)
        })
    }

    //paytm payment 
    handlePayment = () => {
    debugger
        if (this.state.total_price == 0) {
            alert("Please select menu items")
        } else {

            const data = {
                amount: this.state.total_price,
                email: this.state.user_mail,
                mobileNo: "9066808008",
                Orders: [
                    {
                        Item: this.state.dish_name,
                        qty: this.state.qty
                    }
                ]
            };
            this.getCheckSum(data)
                .then(result => {
                    let information = {
                        action: "https://securegw-stage.paytm.in/order/process", //url of paytm server 
                        params: result
                    }
                    this.postTheinfo(information)
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    render() {
        const { restaurants, isMenumodalOpen, Menu, total_price, count } = this.state;
        //const itemCount = this.state[order[itemName]];
        return (
            <div className='container pt-5'>
                {
                    restaurants
                        ?
                        <div>
                            <div className='images'>
                                <Carousel autoPlay={true} infiniteLoop={true} dynamicHeight={false} showArrows={true} >
                                    {
                                        restaurants.thumb.map((item, index) => {
                                            return <img src={require('../' + item).default} alt="images not found" />
                                        })
                                    }

                                    {/* <div>
                                    <img src={require('../Assets/image.png').default} alt="images not found" />
                                    <p className="legend">Dish-1</p>
                                </div>
                                <div>
                                    <img src={require('../Assets/1.png').default} alt="images not found" />
                                    <p className="legend">Dish-2</p>
                                </div>
                                <div>
                                    <img src={require('../Assets/beverages.jpg').default} alt="images not found" />
                                    <p className="legend">Dish-3</p>
                                </div>   */}

                                </Carousel>
                            </div>
                            <div className="restname">
                                {restaurants.name} <Rating className={this.useStyles} name="half-rating-read" defaultValue={restaurants.aggregate_rating} precision={0.5} readOnly />  {restaurants.aggregate_rating}
                            </div>
                            <div className="float-end">
                                <button className="btn-D btn-danger" onClick={this.handleMenu}>Place Online Order</button>
                            </div>
                            <div className="tabs mt-4">
                                <Tabs>
                                    <TabList>
                                        <Tab>Overview</Tab>
                                        <Tab>Contact</Tab>
                                    </TabList>

                                    <TabPanel>
                                        <h2 className='overviewHead mt-4'>About this place</h2>
                                        <h2 className='head mt-4'>Cuisine</h2>
                                        {
                                            restaurants.cuisine.map((item, index) => {
                                                return <li className="viewinfopara">{item.name} </li>
                                            })

                                        }
                                        <p className="viewinfopara"></p>
                                        <h2 className='headinfo mt-4'>Average Cost</h2>
                                        <p className="addinfo"> &#8377; {restaurants.min_price} for two people(approx.) </p>
                                    </TabPanel>
                                    <TabPanel>
                                        <h2 className='head mt-4'>Phone Number</h2>
                                        <p className="infopara">{restaurants.contact_number}</p>
                                        <h2 className='headinfo mt-4'>{restaurants.name}</h2>
                                        <p className="addinfo">{restaurants.city}, {restaurants.locality}</p>
                                    </TabPanel>
                                </Tabs>
                            </div>
                            <br /><br />
                            <Modal isOpen={isMenumodalOpen} className="Menubox">

                                <div className="cancleaicon float-end" onClick={this.closeModal}><CancelIcon /> </div>
                                <h3 className="rest_name my-3 ms-4 mb-4">{restaurants.name}</h3>
                                <ul>
                                    {
                                        Menu.map((item, index) => {
                                            return <li key={index} style={{ 'list-style': 'none' }}>
                                                <div className="row no_gutter">
                                                    <div className="col-9">
                                                        {
                                                            item.isVeg
                                                                ?
                                                                <img src={require('../Assets/veg.png').default} alt="images not found" width="20px" height="25px" />
                                                                :
                                                                <img src={require('../Assets/non-veg.png').default} alt="images not found" width="20px" height="25px" />
                                                        }

                                                        <div className="dish_Name mt-1 ">{item.itemName}</div>
                                                        <div className="dish_price mt-1"> &#8377; {item.itemPrice}</div>
                                                        <div className="dish_desc mt-1 text-muted">{item.itemDescription}</div>

                                                    </div>
                                                    <div className="menu_addbtn col-3 ps-4">
                                                        <div className="menubox ">{this.state[item.itemName]}</div>
                                                        <button className="addbox  ms-5 text-success" onClick={(e) => this.add_items(item, e)} id="myButton1">+</button>
                                                        <button className="addbox text-danger " onClick={(e) => this.remove_items(item, e)}>-</button>
                                                    </div>
                                                    <hr />
                                                </div>
                                            </li>
                                        })
                                    }

                                </ul>
                                <div className="row pay_box">
                                    <div className="col-8">
                                        <div className="price ps-3"> Subtotal &#8377; {total_price}</div>
                                    </div>
                                    <div className="col-4">
                                        <button className="btn-danger float-end paynow" onClick={this.handlePayment}>Pay Now </button>
                                    </div>
                                </div>

                            </Modal>

                        </div>

                        :
                        <div align="center" className="loading">
                            <img src={Spinner} alt="React Logo" width="125rem" height="120vh" />
                        </div>

                }

            </div>
        )
    }
}
export default Details