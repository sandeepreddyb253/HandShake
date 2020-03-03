import React, { Component } from "react";
//import "../../register.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import {register} from '../../ReduxModules/actions/index';
import {connect} from 'react-redux';

class Register extends Component {
  constructor(props) {
    super(props);
    //maintain the state required for this component
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      role:"",
      username:"",
      registerFlag: false
    };
    //Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.firstnameChangeHandler = this.firstnameChangeHandler.bind(this);
    this.lastnameChangeHandler = this.lastnameChangeHandler.bind(this);
    this.roleChangeHandler = this.roleChangeHandler.bind(this);
    this.passnameChangeHandler = this.passnameChangeHandler.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
  }

  
  emailChangeHandler = e => {
    this.setState({
      email: e.target.value
    });
  };

  firstnameChangeHandler = e => {
    this.setState({
      firstName: e.target.value
    });
  };

  lastnameChangeHandler = e => {
    this.setState({
      lastName: e.target.value
    });
  };

  roleChangeHandler = e => {
    this.setState({
      role: e.target.value
    });
  };

  passnameChangeHandler = e => {
    this.setState({
      password: e.target.value
    });
  };

  usernameChangeHandler = e=>{
    this.setState({
      username :e.target.value
    })
  }

   async submitRegister (e)  {
    if(document.forms['registerForm'].reportValidity()){
    // eslint-disable-next-line
    var headers = new Headers();
    //prevent page from refresh
    e.preventDefault();
    console.log("email is", this.state.firstName);
    const data = {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      role: this.state.role,
      password: this.state.password,
      username:this.state.username
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    var   registerData = await this.props?.register(data);
     console.log("Status Code : ", this.props);
      if (this.props?.registerData[0].status === 200) {
        this.setState({
          registerFlag: true
        });
      } else {
        this.setState({
          registerFlag: false
        });
      }
    }
  };

  render() {
    //iterate over books to create a table row
    //if not logged in go to login page
    let redirectVar = null;
    if (this.state.registerFlag) {
      console.log("Register is:::", this.state.registerFlag);
      redirectVar = <Redirect to="/login" />;
    }
    let descVar = 'Last Name';
    let companyName = 'First Name';
    if(this.state.role === 'student'){
      descVar = 'Last Name';
      companyName = 'First Name'
    }else if (this.state.role === 'company'){
      descVar ='Description of your company';
      companyName = 'Name of the company';
    }

    return (
      <div>
        {redirectVar}
        
          <div className="register-form">
            <h1>Register to Handshake</h1>
            <form id = "registerForm" action="register" method="POST">
              <input
                type="email"
                name="email"
                pattern="/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/" 
                onChange={this.emailChangeHandler}
                placeholder="Email"
                required
              />
              <input
                type="text"
                name="username"
                onChange={this.usernameChangeHandler}
                placeholder="User Name"
                required
              />
              <input
                type="text"
                onChange={this.firstnameChangeHandler}
                name="firstname"
                placeholder={companyName}
                required
              />
              <input
                type="text"
                onChange={this.lastnameChangeHandler}
                name="lastName"
                placeholder={descVar}
                required
              />
              <select style = {{width:'300px',height:'50px',marginBottom:'15px'}} onChange={this.roleChangeHandler}>
          <option value="student">student</option>
          <option value="company">company</option>
            </select>
              <input
                type="password"
                onChange={this.passnameChangeHandler}
                name="password"
                placeholder="Password"
                required
              />
              <button onClick={this.submitRegister} className="btn btn-primary">
                Register
              </button>
            </form>
          </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  registerData : state.register.registerData,
});

export default connect (mapStateToProps,{register})(Register);