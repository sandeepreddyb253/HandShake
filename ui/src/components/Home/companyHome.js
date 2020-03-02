import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {auth} from '../../ReduxModules/actions/index';
import {connect} from 'react-redux';

//Define a Login Component
class companyHome extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super classNameName i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username : "",
            password : "",
            authFlag : false
        }

    }


    render(){
        console.log('In Company Home')
        return(
            <div>
                <h4>Hello There !</h4>
            </div>
        )
    }
}



export default companyHome;