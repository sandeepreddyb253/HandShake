import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Applications extends Component {
    constructor(){
        super();
        this.state = {  
            events : []
        }
    }  
    //get the books data from backend  
    componentDidMount(){
        axios.get('http://localhost:8080/events')
                .then((response) => {
                //update the state with the response data
                this.setState({
                    events : this.state.events.concat(response.data) 
                });
            });
    }

    render(){
        
        console.log(this.state.jobs)
        //iterate over books to create a table row
        let details = this.state.events.map(event => {
            return(
                <div className="row" key = {event.event_name}>	
				<div className="well">
						<h3>{event.event_desc}</h3>
						<p> {event.event_time}, {event.location} </p>
                        <p>pending</p>
				</div>
		        </div>    
        )
        })
        //if not logged in go to login page
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }
        return(
            <div>
                {redirectVar}
                <div className="container">
                    <h2> Applications</h2>
                        
                            <div>
                             {details}
                            </div>
                </div> 
            </div> 
        )
    }
}
export default Applications;