import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Register from './Login/Register';
import Home from './Home/home';
import Profile from './Profile/Profile'
// import Delete from './Delete/Delete';
// import Create from './Create/Create';
 import HeaderBar from './Util/HeaderBar';
 import Events from './Events/Events';
 import Applications from './Applications/Applications';
 import Students from './Students/Students'
 import studentprofile from './Students/studentprofile'

import { Provider } from "react-redux";
import store from "../ReduxModules/store/index";
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <Provider store={store}>
            <div>
                {/*Render Different Component based on Route*/}
                <Route  path="/" component={HeaderBar}/> 
                <Route path="/login" component={Login}/>
                 <Route path="/home" component={Home}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/events" component={Events}/>
                <Route path="/applications" component={Applications}/>
                <Route path="/register" component={Register}/>
                <Route path="/students" component={Students}/>
                <Route path="/studentprofile/:id" component={studentprofile}/>
                {/*<Route path="/create" component={Create}/> */}
            </div>
            </Provider>
        )
    }
}
//Export The Main Component
export default Main;