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
 import studentprofile from './Students/studentprofile';
 import companyHome from './Home/companyHome'

import { Provider } from "react-redux";
import store from "../ReduxModules/store/index";
import companyProfile from "./Profile/companyProfile";
import companyViewProfile from "./Profile/companyViewProfile"
import jobStudents from "./Students/jobStudents"
import companyEvents from "./Events/companyEvents"
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
                <Route path = "/companyHome" component = {companyHome}/>
                <Route path = "/companyProfile" component = {companyProfile}/>
                <Route path="/companyViewProfile/:id" component={companyViewProfile}/>
                <Route path="/jobStudents/:id" component={jobStudents}/>
                <Route path="/companyEvents" component={companyEvents}/>
            </div>
            </Provider>
        )
    }
}
//Export The Main Component
export default Main;