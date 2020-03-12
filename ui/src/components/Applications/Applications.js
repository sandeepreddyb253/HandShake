import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

class Applications extends Component {
    constructor(){
        super();
        this.state = {  
            applications : [],
            searchObject :[],
            searchEnabled:false
        }
        this.searchChangeHandler = this.searchChangeHandler.bind(this)
        this.searchHandler = this.searchHandler.bind(this)
        this.cancelHandler = this.cancelHandler.bind(this)
    }  
    //get the books data from backend  
    componentDidMount(){
        if(cookie.load('cookie')){
        var data = cookie.load('cookie').split(':')[1]
       
        axios.get('http://localhost:8080/applications/'+data)
                .then((response) => {
                //update the state with the response data
                this.setState({
                    applications : this.state.applications.concat(response.data) 
                });
            });
    }
    }

    searchChangeHandler(e,type){
        var obj = this.state.searchObject
        obj[type] = e.target.value;
        this.setState({
            searchObject:obj,
            searchEnabled:true
        })
    }
    cancelHandler(){
        if(cookie.load('cookie')){
        this.setState({
            applications:[]
        })
        var data = cookie.load('cookie').split(':')[1]
        axios.get('http://localhost:8080/applications/'+data)
                .then((response) => {
                //update the state with the response data
                this.setState({
                    applications : this.state.applications.concat(response.data),
                    searchEnabled: false 
                });
            });
    }
    }

    searchHandler(){
        var data = cookie.load('cookie').split(':')[1]
        axios.get('http://localhost:8080/applications/'+data+'/?status=' +this.state.searchObject.status)
                .then((response) => {
                this.setState({
                    applications:[]
                })
                this.setState({
                    applications : this.state.applications.concat(response.data),
                    searchEnabled: false 
                });
            });
    }
    render(){
        
       // console.log(this.state.jobs)
        //iterate over books to create a table row
        let details = this.state.applications.map(application => {
            return(
                <div className="row" key = {application.map_application_id}>	
				<div className="well" style = {{height:'200px',width:'90%'}}>
                <div className="col-sm-8" style ={{width:'80%'}}>
						<h3><span style={{fontWeight:'bold'}}>Position: </span> {application.postion}</h3>
						<p> <span style={{fontWeight:'bold'}}>Description: </span> {application.job_desc} ,<span style={{fontWeight:'bold'}}>Location: </span>{application.job_location} </p>
                        <p> <span style={{fontWeight:'bold'}}>Company: </span>{application.company_name} , <span style={{fontWeight:'bold'}}>Applied on: </span>{application.application_date} </p>
                     <p><span className = "glyphicon glyphicon-info-sign"></span><span style={{fontWeight:'bold'}}>Status: </span>{application.status}</p>
				</div>
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
                <div className="col-sm-8">
                    <h2 style ={{marginLeft:'50px'}}> Applications</h2>
                        
                            <div style ={{marginLeft:'50px'}}>
                             {details}
                            </div>
                </div> 
                <div className="col-sm-3" style ={{marginTop:'60px'}}>
				
				<div className="well">
					<h4>Filter
                    </h4>
					<div  className="form-group" >
                    <select style = {{width:'90%',height:'25px'}} onChange = {(e)=>this.searchChangeHandler(e,"status")} placeholder = "status" defaultValue =''>
                    <option value="" disabled >Status</option>
                    <option value="Declined">Accepted</option>
                      <option value="Pending">Pending</option>
                     <option value="Reviewed">Reviewed</option>
                     <option value="Declined">Declined</option>
                    </select>
                        <p></p>
                    <button onClick= {(e)=>this.searchHandler()}  disabled = {!this.state.searchEnabled} style = {{width:'75px'}}>Search</button>
                    <button onClick= {(e)=>this.cancelHandler()}  style = {{width:'75px',marginLeft:'5px'}}>Reset</button>
                     </div>
            	</div>
                </div>
            </div> 
        )
    }
}
export default Applications;