import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import TextareaAutosize from 'react-textarea-autosize';
import {backend} from '../../webConfig'

class companyEvents extends Component {
    constructor(){
        super();
        this.initialState = {  
            events : [],
            redirect :'',
            iseventsaveEnabled : false
        }
        this.state = this.initialState;
        
        this.saveHandler = this.saveHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);

        this.AddEvent = this.AddEvent.bind(this);
        this.EditHandler = this.EditHandler.bind(this);
        this.viewStudents = this.viewStudents.bind(this);
        
        
        
    }  

    viewStudents(id){
        console.log('View Students registered')
        this.setState({ redirect: `/eventStudents/${id}` });
    }

    AddEvent(){
        console.log("Add Experience",this.state.events)
        var newjob={
            event_name:'',
            event_desc:'',
            fk_company_id:cookie.load('cookie').split(':')[1],
            event_time:'',
            location:'',
            Eligibility:'',
            isSaveEnabled:true
        }
        this.setState({
            events : this.state.events.concat(newjob)
        })
    }
    cancelHandler(e,id){
        var data = cookie.load('cookie').split(':')[1]
        this.setState(this.initialState)
        axios.get({backend}+'companyEvents/'+data)
                .then((response) => {
                //update the state with the response data
                this.setState({
                    events : this.state.events.concat(response.data)
                });
            });
        
    }
    
    EditHandler(e,id){
        const events = this.state.events;

        events.map((event) => {
            if (event.event_id === id) {
                event.isSaveEnabled = true;
            }

        })
        this.setState({
            events: events 
        })
    }



    changeHandler(e, id, name, ) {
    const events = this.state.events;
    
    events.map((event) => {
                if (event.event_id === id) {
                    event[name] = e.target.value;
                    console.log(e.target.value)
                }

            })
            this.setState({
                events: events
            })
    }


    
    

   async saveHandler(e,id){

    const events = this.state.events;
    var data ;
    events.map((event) => {
        console.log('job id', event.event_id, '   id::',id)
                if (event.event_id === id) {
                console.log('Match found')
                data = event;
                event.isSaveEnabled = false
                }

            })
    console.log('data in save handler', data)        
   await axios.put({backend}+'saveEvents/', data)
              .then((response)=>{
                  console.log(response.status)
                  if(response.status === 200){
                  this.setState({
                        events  :events
                    })
                    alert(response.data)
                  }
              });
    }

    //get the books data from backend  
    componentDidMount(){
        if(cookie.load('cookie')){
        var data = cookie.load('cookie').split(':')[1]
        console.log(data)
        axios.get({backend}+'/companyevents/'+data)
        .then((response) => {
        this.setState({
            events : this.state.events.concat(response.data)
        });
    });
    }
    }

    render(){

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
            }
        
        
        let jobDetails = this.state.events.map(obj=>{
            return(
                <div key ={obj.event_id} className = "well"> 

					<p style ={{fontWeight: 'bold'}}>Event Name:
                    <button onClick= {(e)=>this.EditHandler(e,obj.event_id)} style = {{width:'45px',float:'right',height:'19px',fontSize:'12px'}} > Edit</button></p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.event_id,"event_name")} defaultValue = {obj.event_name}/>
                    </div>
					
					<p style ={{fontWeight: 'bold'}}>Event Description:</p>
					
                    <div className="form-group">
                        <TextareaAutosize  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.event_id,"event_desc")} defaultValue = {obj.event_desc}/>
                    </div>
                    <p style ={{fontWeight: 'bold'}}>Eligibilty:</p>
                    <select style = {{width:'300px',height:'50px',marginBottom:'15px'}} disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.event_id,"eligiblity")} defaultValue = {obj.eligiblity}>
                        <option value="All">All</option>
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Computer Engineering">Computer Engineering</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                    </select>
                    <p style ={{fontWeight: 'bold'}}>Event Location:</p>
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.event_id,"location")} defaultValue = {obj.location}/> 
                     <p style ={{fontWeight: 'bold'}}>Event Time:</p>
                    <div className="form-group">
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.event_id,"event_time")} defaultValue = {obj.event_time}/>
                         <button onClick= {(e)=>this.viewStudents(obj.event_id)}  style = {{width:'75px',float:'right',marginTop:'-20px'}}>Students</button> 
                    </div>
                    <button onClick= {(e)=>this.saveHandler(e,obj.event_id)} hidden = {!obj.isSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler(obj.event_id)} hidden = {!obj.isSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
                    
				</div>
            )
        })


        
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
            
        }
        

        return(
            <div style = {{marginLeft: '250px'}}>
                {redirectVar}
                <div className="row">
			<div className="col-sm-8" >
			<div>
					<h3>Events 
                 <button onClick= {this.AddEvent} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px',marginLeft:'5px'}} > Add</button> 
                </h3>
        			{jobDetails}
                    
				</div>

				
				
			</div>
		</div> 
            </div> 
        )
    }
}
//export Profile Component
export default companyEvents;