import { Component } from 'react'
import {Route, BrowserRouter} from 'react-router-dom' 
import Home from './components/Home'
import Filters from './components/Filters'
import Details from './components/Details'
import Header from './components/Header'
import Success from './components/Success'
import Failure from '../src/components/Failure'

class Routers extends Component {
   
    render(){
    return (
        <BrowserRouter>
            <Header />
            <Route exact path={'/'} component={Home} />
            <Route path={'/home'} component={Home} />
            <Route path={'/filter'} component={Filters} />
            <Route path={'/details'} component={Details}  />
            <Route path={'/Success'} component={Success}  />
            <Route path={'/Failure'} component={Failure}  />
        </BrowserRouter>
    )
    }
}
export default Routers;