import React, { Component } from 'react'
import { withRouter } from "react-router-dom";

 class Quickseach extends Component {
   
    handleClick(id,heading) {
        const url=`/filter?mealtype=${id}&mealTypeName=${heading}`
        this.props.history.push(url);
    }
    render() {
        const {heading, imagesrc ,content, mealtypeid} = this.props; 
        return (
            <>
                <div className="col-12 col-md-6 col-lg-5 col-xxl-4" onClick={()=> {this.handleClick(mealtypeid,heading)}}>   
                    <div className="qsitems">
                        <img src={imagesrc} alt='homepage' />
                        <div className="qsdesc">     
                            <h4 className="texthead">{heading}</h4>
                            <p>{content}</p>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default withRouter(Quickseach);