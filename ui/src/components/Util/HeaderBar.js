import React,{Component} from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import axios from 'axios';
import {Redirect} from 'react-router';
import {backend} from '../../webConfig'

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            headerArray : [],
            firstTime: true
        }
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove('cookie', { path: '/' })
        console.log('logging you out mate...')
    }

    componentDidMount(){
        axios.get(backend+'tabHeaders/')
                .then((response) => {
                //update the state with the response data
                this.setState({
                    headerArray : this.state.headerArray.concat(response.data),
                    firstTime:false
                });
            });
        }
            
    
    
    render(){
        //if Cookie is set render Logout Button
        let navLogin = null;
        let image = null;
        
        if(cookie.load('cookie')){
            data = cookie.load('cookie').split(':')[0]
            console.log("Able to read cookie", );
            let roleHeaders = []
            this.state.headerArray.forEach(obj=>{
            if(obj.role_name === data){
                roleHeaders.push(obj)
            }
            })

           let headers =  roleHeaders.map(header => {
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
            navLogin = (
                <ul className="nav navbar-nav navbar-right">
                        <li><Link style = {{color:'white'}} to="/register"><span className="glyphicon glyphicon-tasks"></span> Register</Link></li>
                        <li><Link style = {{color:'white'}} to="/login"><span className="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }
        let redirectVar = null;
        if(cookie.load('cookie')){
            var data = cookie.load('cookie').split(':')[0]
            console.log('Data:',data)
            if(data==='student'){   
            redirectVar = <Redirect to="/home"/>
        }else if(data === 'company')
        {
            redirectVar = <Redirect to="/companyHome"/>
        }
        }
        return(
            <div style = {{background:'#f7f7f7'}}>
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