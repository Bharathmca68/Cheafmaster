import React, { Component } from 'react'
import { withRouter } from 'react-router';
import Modal from 'react-modal'
// import axios from 'axios';
import axios from './axios';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CancelIcon from '@material-ui/icons/Cancel';


import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';


import '../styles/Header.css'


class Header extends Component {
    constructor() {
        super();
        this.state = {
            background: 'transparent',
            isLoginmodalOpen: false,
            isSignmodalOpen: false,
            User_name: '',
            pass: '',
            user: [],
            isLoggedIn: false,
            LoginError: undefined,
            SignUpError: undefined,
            FN: undefined,
            LN: undefined,
            google_user_name: '',
            order_details: [],
            u_mail: '',
            isCartModalOpen: false
        };
    }

    componentDidMount() {

        const initialpath = this.props.history.location.pathname;
        this.setHeaderstyle(initialpath)

        this.props.history.listen((location, action) => {
            this.setHeaderstyle(location.pathname)
        });
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        let user = localStorage.getItem("user");
        
        
        
        debugger
        if (user) {
            user = JSON.parse(user);
            let Temp_user = user.email 
            localStorage.setItem("temp_user",Temp_user)
        }
        
        
        
        
        this.setState({
            user: user,
            isLoggedIn: isLoggedIn
        });
    }

    setHeaderstyle = (path) => {
        let bg = ''
        if (path === '/' || path === '/home') {
            bg = 'transparent'
        }
        else {
            bg = 'coloured'
        }
        this.setState({
            background: bg
        });
    }

    handlemodal = () => {
        this.setState({
            isLoginmodalOpen: true
        })
    }

    // handle_Login = () => {

    //     const {User_name, pass} =this.state

    //     const obj={
    //         email: User_name,
    //         password: pass
    //     }
    //     //call API for Login USer

    //      axios({
    //         method:'POST',
    //         url: 'http://localhost:1998/userlogin',
    //         header: { 'Content-Type': 'application/json' },
    //         data: obj
    //         }).then(result => {
    //             this.setState({
    //                 User_Login : result.data.user[0],
    //                 isLoggedIn: true,
    //             });
    //         this.handleReset();
    //         }).catch(error =>{
    //             console.log(error)
    //         })
    // }


    handleLogin = () => {
    
        // call the API to login the user
        const { User_name, pass } = this.state;
        const obj = {
            email: User_name,
            password: pass
        }
        axios({
            method: 'POST',
            url: '/userlogin',
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem("user", JSON.stringify(result.data.user[0]));
            localStorage.setItem("isLoggedIn", true);
            this.setState({
                user: result.data.user[0],
                isLoggedIn: true,
                LoginError: undefined
            });
            this.handleReset();
        }).catch(error => {
            this.setState({
                LoginError: "username or password is incorrect"
            })
            console.log(error);
        });
    }

    handlecart = () => {

      
        const { user } = this.state;
        // let apb = user.email 
        // localStorage.setItem("user_aml",apb)
        this.setState({
            isCartModalOpen: true
        })
        axios.get(`/getuserorders/${user.email}`)

            .then(result => {
                this.setState({
                    order_details: result.data.order_details
                })
            }).catch(error => {
                console.log(error)
            })
    }


    handleReset = () => {
        this.setState({
            isLoginmodalOpen: false,
            User_name: '',
            pass: '',
            LoginError: undefined

        });
    }

    handleChange = (event, field) => {

        this.setState({
            [field]: event.target.value,
            LoginError: undefined,
            SignUpError: undefined
        })
    }


    handle_Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false,

        });
    }

    handlemodalacc = () => {
        this.setState({
            isSignmodalOpen: true
        })
    }

    handleSinUp = () => {
        const { User_name, pass, FN, LN } = this.state;
        const obj = {
            email: User_name,
            password: pass,
            firstName: FN,
            lastName: LN
        }
        axios({
            method: 'POST',
            url: '/getusersign',
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            this.setState({
                user: result.data.user[0],
                SignUpError: undefined
            });
            this.handleSinUPReset();
            alert("user Registered successfully")
        }).catch(error => {
            this.setState({
                SignUpError: "Please fill the cardinalities"
            })
            console.log(error);
        });
    }

    handleSinUPReset = () => {
        this.setState({
            isSignmodalOpen: false,
            User_name: '',
            pass: '',
            FN: '',
            LN: ''

        });
    }

    handle_Icone = () => {
        this.props.history.push(`/`)
    }



    handle_FB_login = () => {

    }

    responseSuccessGoogle = (res) => {
        const { google_user_name } = this.state
        this.setState({
            isLoginmodalOpen: false,
            google_user_name: res.profileObj.name
            // console.log(res.profileObj.name)
        })

    }
    responseFailureGoogle = (res) => {
        console.log(res)
    }



    //cart 
    closeModal = () => {
        this.setState({
            isCartModalOpen: false
        })
    }

    render() {
        const { background, isLoginmodalOpen, User_name, pass, isLoggedIn, user, LoginError, FN, LN, isSignmodalOpen, SignUpError, isCartModalOpen, order_details, google_user_name } = this.state
        return (
            <div className='Headers' style={{ 'background': background == 'transparent' ? 'transparent' : 'red' }}>

                {
                    background == 'coloured'
                        ?
                        <div className="logos">
                            <i className="fa fa-cutlery " aria-hidden="true" onClick={this.handle_Icone}></i>
                        </div>
                        :
                        null
                }

                <div className='float-end' >
                    {
                        isLoggedIn
                            ?
                            <div>
                                <span className="text-white m-2" > {user.firstName} </span>
                                <button className="btnww" onClick={this.handle_Logout}>Logout</button>
                                <ShoppingBasketIcon onClick={this.handlecart} style={{ 'font-size': '50px', 'margin-left': '2px', 'color': 'white' }} />
                            </div>
                            :
                            <div>

                                <button className="logins" onClick={() => this.handlemodal()}>Login</button>
                                <button className="btnww" onClick={() => this.handlemodalacc()}>Create Account</button>
                            </div>
                    }

                </div>
                <Modal isOpen={isLoginmodalOpen} className="loginbox">
                    <div align='center' className='accicon'><AccountCircleIcon /> </div>
                    <h3 align='center'>User Login </h3>
                    <form className='my-2'>
                        {
                            LoginError
                                ?
                                <div className="alert alert-danger"> {LoginError} </div>
                                :
                                null
                        }

                        <div className="mb-3">
                            <label className="form-label" >User Mail</label>
                            <input value={User_name} className="form-control" type='text' onChange={(event) => this.handleChange(event, 'User_name')} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input value={pass} type="password" className="form-control" onChange={(event) => this.handleChange(event, 'pass')} />
                        </div>
                        <div className="form-text text-white">We'll never share your details with anyone else.</div>

                        <div align='center' className="mt-3">
                            <input type="button" className="btnbut_login btn-secondary start-0" onClick={this.handleLogin} value="Login" />
                            <input type="button" className="btnbut_login btn-danger" onClick={this.handleReset} value="Close" />
                        </div>
                        <div className="mt-3">
                            <FacebookLogin
                                appId="279168367236397"
                                textButton="Continue with facebook"
                                size="metro"
                                fields="name,email,picture"
                                callback={this.handle_FB_login}
                                cssClass="FB_login_btn "
                                icon="bi bi-facebook pe-3  fa-lg"
                            />

                            <GoogleLogin
                                clientId="262532078867-of5r7h3u799liogl3m4a5f2192a2gv0t.apps.googleusercontent.com"
                                buttonText="Continue with Google"
                                onSuccess={this.responseSuccessGoogle}
                                onFailure={this.responseFailureGoogle}
                                cookiePolicy={'single_host_origin'}
                                icon="true"
                                className="google mt-1 ps-5"
                                theme="dark"

                            />

                        </div>
                    </form>
                </Modal>
                <div>
                    <Modal isOpen={isSignmodalOpen} className="signbox">
                        <div align='center' className="personaddicon"><PersonAddIcon /> </div>
                        <h3 align='center'>User Registrations</h3>
                        <form className='my-2'>
                            {
                                SignUpError
                                    ?
                                    <div className="sign_Up_alert alert-danger"> {SignUpError} </div>
                                    :
                                    null
                            }
                            <div className="mb-3">
                                <label className="form-label" >Email</label>
                                <input value={User_name} className="form-control" type='text' onChange={(event) => this.handleChange(event, 'User_name')} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input value={pass} type="password" className="form-control" onChange={(event) => this.handleChange(event, 'pass')} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input value={FN} type="text" className="form-control" onChange={(event) => this.handleChange(event, 'FN')} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input value={LN} type="text" className="form-control" onChange={(event) => this.handleChange(event, 'LN')} />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" />
                                <label className="form-check-label">i agree teams and conditions</label>
                            </div>
                            <div align='center' className="my-2">
                                <input type="button" className="btnbut btn-secondary start-0" onClick={this.handleSinUp} value="SignUP" />
                                <input type="button" className="btnbut btn-danger" onClick={this.handleSinUPReset} value="Close" />
                            </div>
                            <div className="mt-3">
                                <FacebookLogin
                                    appId="279168367236397"
                                    textButton="Continue with facebook"
                                    size="metro"
                                    fields="name,email,picture"
                                    callback={this.handle_FB_login}
                                    cssClass="FB_login_btn "
                                    icon="bi bi-facebook pe-3  fa-lg"
                                />

                                <GoogleLogin
                                    clientId="262532078867-of5r7h3u799liogl3m4a5f2192a2gv0t.apps.googleusercontent.com"
                                    buttonText="Continue with Google"
                                    onSuccess={this.responseSuccessGoogle}
                                    onFailure={this.responseFailureGoogle}
                                    cookiePolicy={'single_host_origin'}
                                    icon="true"
                                    className="google mt-1 ps-5"
                                    theme="dark"

                                />

                            </div>
                        </form>
                    </Modal>
                </div>
                <Modal isOpen={isCartModalOpen} className="cartbox">
                    <div className="cancleaicon float-end" onClick={this.closeModal}><CancelIcon /> </div>
                            <h1 className="my-4" align="center">Order Details</h1>

                    {
                        order_details.map((item, index) => {
                            return <li key={index} style={{ 'list-style': 'none' }}>
                                <div className="row no_gutter">
                                    <div className="col-9">

                                        <div className="dish_Name mt-1 ">{item.Menu_item.map((itemabcd, index) => {
                                            return <>
                                                <div>Order dish : {itemabcd.Item}</div>
                                            </>

                                        })}</div>


                                        <div className="dish_price mt-1"> Price : &#8377; {item.Total_Amount}</div>
                                        <div className="order_dish_desc  text-muted">Address : {item.Address}</div>
                                        <span className="order_dish_desc  text-muted">Contact : {item.Contact}</span>

                                    </div>
                                    <hr />
                                </div>
                            </li>
                        })

                    }
                </Modal>
            </div>
        )
    }
}
export default withRouter(Header)