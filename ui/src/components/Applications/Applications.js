import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Applications extends Component {
    constructor(){
        super();
        this.state = {  
            applications : []
        }
    }  
    //get the books data from backend  
    componentDidMount(){
        var data = 1;
        axios.get('http://localhost:8080/applications/'+data)
                .then((response) => {
                //update the state with the response data
                this.setState({
                    applications : this.state.applications.concat(response.data) 
                });
            });
    }

    render(){
        
       // console.log(this.state.jobs)
        //iterate over books to create a table row
        let details = this.state.applications.map(application => {
            return(
                <div className="row" key = {application.map_application_id}>	
				<div className="well">
						<h3>{application.postion}CEO</h3>
						<p> {application.job_desc} CEO of Apple, {application.job_location} San Jose</p>
                        <p> {application.company_name} Apple Inc., || Applied: {application.application_date} </p>
                     <p><span className = "glyphicon glyphicon-info-sign"></span>Status: {application.status}</p>
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