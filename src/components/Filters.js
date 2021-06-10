import React, { Component } from 'react'
// import  axios  from "axios";
import  axios  from "./axios";
import queryString from 'query-string';

import { withRouter } from 'react-router';

import Rating from '@material-ui/lab/Rating';
import { makeStyles } from '@material-ui/core/styles';

import '../styles/Filters.css'




class Filters extends Component {




    constructor(){
        super();
        this.state={
            locations : [],
            locInCity : [],
            selectedCityName : '',
            meal_Type_ID : 0,
            meal_Type_Name : '',
            restaurantList : [],
            selectLocation:0,
            cuisines :[],
            hCost : undefined,
            lCost : undefined,
            sortDir: 1,
            pageNo : 1,
            totalRestaurant : 0,
            page_Size: 2,
            numOfPage : 0

        };
    }

    componentDidMount() {
        const qString = queryString.parse(this.props.location.search);
        const { mealtype, mealTypeName } = qString;
        this.setState({
            meal_Type_ID : mealtype,
            meal_Type_Name :  mealTypeName
        });
        const c_id = localStorage.getItem("city_id")
        axios.get('/getalllocation')
            .then(result => {
                const locations = result.data.locations;
                const selectedCity = locations.find(city => city.city_id == c_id);
                const cityLocation = locations.filter(city => city.city_id == c_id);
                this.setState({
                    locations: result.data.locations,
                    selectedCityName: selectedCity.city,
                    locInCity: cityLocation,
                    selectLocation: cityLocation[0].location_id
                });
                setTimeout(() => {
                    this.filterRestaurants();
                }, 0);
                
            
            })
            .catch(error => {
                console.log(error)
            });     
             
    }

    handleLocationChange(e){
        const Location_ID = e.target.value;
        this.setState ({
            selectLocation: Location_ID
        }) 
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleCuisineChange(event, cus) {
        let { cuisines } = this.state;
        const index = cuisines.indexOf(cus);

        if (index < 0 && event.target.checked) {
            cuisines.push(cus);
        } else if (!event.target.checked) {
            cuisines.splice(index, 1);
        }

        this.setState({
            cuisines: cuisines
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handlechangeAmout(event, lowCost, highCost){
        this.setState({
            hCost : highCost,
            lCost : lowCost
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    handleSort(e,sorting){
        this.setState({
            sortDir:sorting
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }



    handlePaginate(page_no){
        if (page_no < 1 ) {
           return ;
        }
        this.setState({
            pageNo : page_no
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    }

    gotoDetails(item){
        const url=`/details?restaurantID=${item._id} `;
        this.props.history.push(url);
    }

    filterRestaurants(){
        const  {meal_Type_ID ,selectLocation, cuisines, hCost, lCost, sortDir, pageNo}  = this.state;
        const req = {
            mealType: meal_Type_ID,
            page : pageNo
           
        };
        if(selectLocation){
            req.location =  selectLocation;
        }
        if(cuisines.length > 0){
            req.cuisine = cuisines
        }
        if(hCost != undefined && lCost != undefined){
            req.hcost = hCost;
            req.lcost = lCost;
        }
        if(sortDir !=undefined){
            req.sort =sortDir
        }
        axios({
            method: 'POST',
            url: '/filterRestaurants',
            headers: { 'Content-Type' : 'application/json' },
            data: req
        }).then(result => {
            const totalRestaurant = result.data.totalRestaurantCount;
            const page_Size = result.data.pageSizeNo;
            
            
            let quotient = totalRestaurant / page_Size
            quotient = Math.floor(quotient);
            let numOfPage = quotient;
            const remainder = totalRestaurant % page_Size; 
            if(remainder > 0){
                numOfPage = quotient + 1;
            }

            this.setState({
                restaurantList : result.data.restaurant,
                pageNo : result.data.pageNO,
                totalRestaurant : result.data.totalRestaurantCount,
                page_Size : result.data.pageSizeNo,
                numOfPage : numOfPage
            });

        

        }).catch(error => {
            console.log(error)
        });
    }

    getPages() {
        const { numOfPage } =this.state
        let pages = []
        for(let i = 0; i < numOfPage; i++ ){
            pages.push(<span key={i} onClick={() => this.handlePaginate(i + 1)} className="paginationButton">{i + 1}</span>)
        }
        return pages
    }

    render() {
     const { selectedCityName, locations ,meal_Type_Name, locInCity, restaurantList} = this.state; 
        let { pageNo } = this.state
        


        return (
            <>
                {/* <div id="headers">
                    <div className="logos"> 
                        <i className="fa fa-cutlery " aria-hidden="true"></i>
                    </div>
                        <a href="#" className="logins">Login</a>
                        <button className="btnww">Create Account</button>
                </div> */}
                <div className="container pt-3">
                    <div className="row heading my-4">
                        {meal_Type_Name} Places in {selectedCityName}
                    </div>
                    <div className="row">
                        <div className="col-4 col-md-6 filterSection">
                            <div className="sectionHeading">Filters</div>
                            <div className="sectionSubHeading">Select Location</div>
                            <select className="locationSelection" onChange={(e)=> this.handleLocationChange(e)}>
                                {
                                    locInCity.map((item,index)=> {
                                        return <option key={index} value={item.location_id}>{item.name}</option>
                                    })
                                }
                                {/* {<option>Mumbai</option>
                                <option>Delhi</option>
                                <option>Bangalore</option>
                                <option>Hyderabad</option>} */}
                            </select>
                            <div className="sectionSubHeading">Cuisine</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'North Indian')}/> North Indian</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'South Indian')} /> South Indian</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Chinese')}/> Chinese</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Fast Food')}/> Fast Food</div>
                            <div className="cuisineSelection"><input type="checkbox" onChange={(e) => this.handleCuisineChange(e, 'Street Food')}/> Street Food</div>
                            <div className="sectionSubHeading">Cost for two</div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e)=> this.handlechangeAmout(e,0,500)}/> Less than &#8377; 500 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e)=> this.handlechangeAmout(e,500,1000)}/> &#8377; 500 to &#8377; 1000 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e)=> this.handlechangeAmout(e,1000,1500)}/> &#8377; 1000 to &#8377; 1500 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e)=> this.handlechangeAmout(e,1500,2000)}/> &#8377; 1500 to &#8377; 2000 </div>
                            <div className="cuisineSelection"><input type="radio" name="cost" onChange={(e)=> this.handlechangeAmout(e,2000,100000)}/> &#8377; 2000+ </div>
                            <div className="sectionSubHeading">Sort</div>
                            <div className="cuisineSelection"><input type="radio" name="sort" onChange={(e)=> this.handleSort(e,1)}/> Price low to high </div>
                            <div className="cuisineSelection"><input type="radio" name="sort" onChange={(e)=> this.handleSort(e,-1)}/> Price high to low </div>
                        </div>
                        <div className="col-8 resultSection">

                            {
                                restaurantList.length > 0 
                                ?
                                restaurantList.map((item,index)=> {
                                    return <div key={index} className="row resultBox" onClick={()=> this.gotoDetails(item)}>
                                                <div className="topSection row">
                                                    <div className="col-3 col-sm-6 col-md-3">
                                                        <img className="resultImage" src={require('../' + item.image).default} alt='homepage'/>
                                                    </div>
                                                    <div className="col-9 col-sm-6 col-md-9">
                                                        <div className="resultHeader">{item.name}</div>
                                                        <div className="resultSubHeader">{item.locality}</div>
                                                        {/* <div className={classes.root}>
                                                            <Rating name="half-rating-read" defaultValue={4} precision={0.5} readOnly />
                                                        </div> */}
                                                        <div className="resultDescription">{`${item.city}`}</div>
                                                        <div className="ms-4">
                                                            <Rating className={this.useStyles} name="half-rating-read" defaultValue={item.aggregate_rating} precision={0.5} readOnly /> 
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="bottomSection row">
                                                    <div className="col-4 col-sm-4 col-md-4">
                                                        <div className="resultdetils">
                                                            CUISINES:
                                                        </div>
                                                        <div className="resultdetils">
                                                            COST FOR TWO:
                                                        </div>
                                                    </div>
                                                    <div className="col-8 col-sm-8 col-md-8">
                                                        <div className="resultdetilsOptions">
                                                            {
                                                                item.cuisine.map((VB,index)=> {
                                                                    return ` (${VB.name})  ` 
                                                                })
                                                            }
                                                        </div>
                                                        <div className="resultdetilsOptions">
                                                            &#8377; {item.min_price}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                })
                                :
                                <div className="row resultBox">
                                    <h3 className="text-danger text-center" style={{'padding':'80px'}}>Sorry No Restaurant Found</h3>
                                </div> 
                            }
                            
                            {/* <div className="row resultBox">
                                <div className="topSection row">
                                    <div className="col-3 col-sm-6 col-md-3">
                                        <img className="resultImage" src={require('../Assets/bf.png').default} alt='homepage'/>
                                    </div>
                                    <div className="col-9 col-sm-6 col-md-9 subhead">
                                        <div className="resultHeader">The Bake Shop</div>
                                        <div className="resultSubHeader">FORT</div>
                                        <div className="resultDescription">Shop 1, Plot D, Samruddhi Complex, Chincholi …</div>
                                    </div>
                                </div>
                                <hr />
                                <div className="bottomSection row">
                                    <div className="col-4 col-sm-4 col-md-4">
                                        <div className="resultdetils">
                                            CUISINES:
                                        </div>
                                        <div className="resultdetils">
                                            COST FOR TWO:
                                        </div>
                                    </div>
                                    <div className="col-8 col-sm-8 col-md-8">
                                        <div className="resultdetilsOptions">
                                            Bakery
                                        </div>
                                        <div className="resultdetilsOptions">
                                            &#8377; 700
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {
                                restaurantList.length > 0 
                                ?
                                    <div className="paginationOptions">
                                        <span className="paginationButton" onClick={() => this.handlePaginate(--pageNo)}>&#8592;</span>
                                        {
                                            this.getPages()
                                        }
                                        {/* <span className="paginationButton">1</span>
                                        <span className="paginationButton">2</span>
                                        <span className="paginationButton">3</span>
                                        <span className="paginationButton">4</span>
                                        <span className="paginationButton">5</span> */}
                                        <span className="paginationButton" onClick={() => this.handlePaginate(++pageNo)}>&#8594;</span>
                                    </div>
                                :
                                <div></div>
                            }
                            
                        </div>
                    </div>
                    <br/>
                    <br/><br/><br/>
                </div>
            </>
        )
    }
}
export default withRouter(Filters);