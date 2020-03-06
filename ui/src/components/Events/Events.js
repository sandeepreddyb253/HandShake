import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Popup from "reactjs-popup";

class Events extends Component {
    constructor(){
        super();
        this.state = {  
            events : [],
            studentEvents:[],
            searchEnabled:false,
            searchObject:[]
        }
        this.saveRegistration = this.saveRegistration.bind(this)
        this.cancelHandler = this.cancelHandler.bind(this)
        this.searchHandler = this.searchHandler.bind(this)
        this.searchChangeHandler = this.searchChangeHandler.bind(this)
    }  
    //get the books data from backend  
    componentDidMount(){
        if(cookie.load('cookie')){
            var data = cookie.load('cookie').split(':')[1]
        axios.get('http://localhost:8080/events/'+data)
                .then((response) => {
                //update the state with the response data
                this.setState({
                    events : this.state.events.concat(response.data.events),
                    studentEvents: this.state.studentEvents.concat(response.data.studentEvents)
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
    this.setState({
        events:[]
    })
    if(cookie.load('cookie')){
        var data = cookie.load('cookie').split(':')[1]
    axios.get('http://localhost:8080/events/'+data)
            .then((response) => {
            //update the state with the response data
            this.setState({
                events : this.state.events.concat(response.data.events),
               // studentEvents: this.state.studentEvents.concat(response.data.studentEvents)
            });
        });
    }
}

searchHandler(){
    var data = cookie.load('cookie').split(':')[1]
    axios.get('http://localhost:8080/events/'+data+'/?event_name=' +this.state.searchObject.event_name)
            .then((response) => {
            this.setState({
                events:[]
            })
            this.setState({
                events : this.state.events.concat(response.data.events),
                searchEnabled: false 
            });
        });
}

saveRegistration(event_id){
    const data = {
        event_id : event_id,
        studentId : cookie.load('cookie').split(':')[1]
       }
       const events = this.state.events;
       events.map((event)=>{
           if(event.event_id === event_id){
            event.status = 'Registered'
            event.disable = 'true'
           }
       })
       axios.post('http://localhost:8080/saveRegister',data)
       .then(response => {
           console.log("Status Code : ",response.status);
           if(response.status === 200){
               this.setState({
                   events:events
               })
               console.log('Done')
           }else{
               console.log('Error in saving application');
           }
       });


}

    render(){
        
        console.log(this.state.events)
        //iterate over books to create a table row
        let details = this.state.events.map(event => {
            return(
                <div className="row" key = {event.event_id}>
                <div className = "well" style = {{height:'200px',width:'85%',marginLeft:'50px'}}>
				<div className="col-sm-8" style ={{width:'80%'}}>
						<h3>{event.event_name}</h3>
                        <p> { event.location} </p>
                         <button  style = {{float :'left',width :'85px',height:'30px'}} disabled = {event.disable} onClick = {(e)=>this.saveRegistration(event.event_id)}> {event.status}</button>
                        
				</div>
                <div className = "col-sm-3" style ={{width:'20%'}}>
                <img style = {{width:'100%',marginTop:'20px',marginBottom:'20px'}} src ={require("../Util/Handshake.jpg") }></img> 
                <Popup trigger={<a style = {{marginTop:'20px',align:'center'}}>More Details..</a>}
                         modal
                    closeOnDocumentClick>
                <div> <h4 style = {{fontWeight:'bold'}}>Event Description</h4>
                   <p> {event.event_desc}</p>
                   <p style = {{fontWeight:'bold'}}>Eligibility:</p>
                    <p>{event.eligiblity}</p>
                    <p style = {{fontWeight:'bold'}}>Date: </p>
                    <p>{event.event_time}</p>
                </div>
                </Popup>
                
                </div>
		        </div> 
                </div>    
        )
        })
        let studentEventsDetails = this.state.studentEvents.map(event => {
            return(
                <div className="row" key = {event.fk_event_id}>
                <div className = "well" style = {{height:'100px',width:'90%'}}>
				<div className="col-sm-8" style ={{width:'80%'}}>
						<h3>{event.event_name}</h3>
                        
				</div>
                <div className = "col-sm-3" style ={{width:'20%'}}>
                <Popup trigger={<a style = {{marginTop:'20px',align:'center'}}>More Details..</a>}
                         modal
                    closeOnDocumentClick>
                <div> <h4 style = {{fontWeight:'bold'}}>Event Description</h4>
                   <p> {event.event_desc}</p>
                   <p style = {{fontWeight:'bold'}}>Eligibility:</p>
                    <p>{event.eligibility}</p>
                    <p style = {{fontWeight:'bold'}}>Date: </p>
                    <p>{event.event_time}</p>
                </div>
                </Popup>
                
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
                <div>
				
				<div className="well">
					<h4>Search
                    </h4>
					<div  className="form-group" >
                    <input type = "text" style = {{width:'75%',height:'25px',borderRadius:'7px'}} onChange = {(e)=>this.searchChangeHandler(e,"event_name")} placeholder = "Event Name" defaultValue =''/>
                    <button onClick= {(e)=>this.searchHandler()}  disabled = {!this.state.searchEnabled} style = {{width:'75px'}}>Search</button>
                    <button onClick= {(e)=>this.cancelHandler()}  style = {{width:'75px',marginLeft:'5px'}}>Reset</button>
                     </div>
            	</div>
                </div>
                <div className="col-sm-8">
                    <h2 style = {{marginLeft:'50px'}}>List of All Events</h2>
                        
                            <div>
                             {details}
                            </div>
                </div> 
                <div className="col-sm-3">
                    <h2>Your Upcoming Events</h2>
                        
                            <div>
                             {studentEventsDetails}
                            </div>
                </div>
            </div> 
        )
    }
}
export default Events;