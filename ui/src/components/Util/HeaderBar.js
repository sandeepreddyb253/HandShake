import React,{Component} from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            headerArray : []
        }
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
    }

    componentDidMount(){
        axios.get('http://localhost:8080/tabHeaders')
                .then((response) => {
                //update the state with the response data
                this.setState({
                    headerArray : this.state.headerArray.concat(response.data)
                });
            });
            
    }
    
    render(){
        //if Cookie is set render Logout Button
        let navLogin = null;
        let image = null;
        
        if(cookie.load('cookie')){
            console.log("Able to read cookie", cookie.load('cookie'));
            
           let headers =  this.state.headerArray.map(header => {
                return(
                    <ul className = "nav navbar-nav" key ={header.tab_name}>
                    
                        <li ><Link to={header.route_path}>{header.tab_display_name}</Link></li>
                         {/* <li id ="profile"><Link style = {{color:'white'}} to="/profile">Profile</Link></li> */}
                    
                    </ul>    
            )
            })
            navLogin = (
                <ul className="nav navbar-nav navbar-right">
                        {headers }
                        <li><Link  style = {{color:'white'}} to="/" onClick = {this.handleLogout}><span className="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
        }else{
            //Else display login button
            console.log("Not Able to read cookie");
            image = (
                
                    <img style = {{width:'100%',height:'100%',marginTop:'-20px'}}src={require('./Handshake.jpg')} />
                     )
            
            console.log({image})
            navLogin = (
                <ul className="nav navbar-nav navbar-right">
                        <li><Link style = {{color:'white'}} to="/register"><span className="glyphicon glyphicon-tasks"></span> Register</Link></li>
                        <li><Link style = {{color:'white'}} to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }
        let redirectVar = null;
        if(cookie.load('cookie')){
            redirectVar = <Redirect to="/home"/>
        }
        return(
            <div>
                {redirectVar}
            <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href = '/home'>Handshake</a>
                    </div>
                    
                    {navLogin}
                    
                </div>
            </nav>
            {/* {image} */}
        </div>
        
        )
    }
}

export default Navbar;