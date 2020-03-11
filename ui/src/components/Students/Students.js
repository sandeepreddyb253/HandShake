import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Popup from "reactjs-popup";


class Students extends Component {
    constructor(){
        super();
        this.initialState ={
            students : [],
            redirect:'',
            searchObject:[],
            searchEnabled:true
        }

        this.state = this.initialState;
        this.viewProfile = this.viewProfile.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.searchHandler = this.searchHandler.bind(this)
        this.cancelHandler = this.cancelHandler.bind(this)
    }  

    changeHandler(e,type){
        var obj = this.state.searchObject
        obj[type] = e.target.value;
        this.setState({
            searchObject:obj,
            searchEnabled:true
        })
    }

    cancelHandler(){
        this.setState(this.initialState);
        axios.get('http://localhost:8080/getAllStudents/?first_name='+''+'&major='+''+'&college_name='+'' )
                .then((response) => {
                //update the state with the response data
                this.setState({
                    students : this.state.students.concat(response.data) 
                });
            });
    }

    searchHandler(){
        console.log('search with these', this.state.searchObject)
       
        axios.get('http://localhost:8080/getAllStudents/?first_name='+this.state.searchObject.first_name+'&major='+this.state.searchObject.major+'&college_name='+this.state.searchObject.college_name+'&skills='+this.state.searchObject.skills)
                .then((response) => {
                this.setState(this.initialState);
                    //update the state with the response data
                this.setState({
                    students : this.state.students.concat(response.data), 
                    searchEnabled:false
                });
            });
        
    }
    //get the books data from backend  
    componentDidMount(){
        var data =''
        axios.get('http://localhost:8080/getAllStudents/?first_name='+''+'&major='+''+'&college_name='+'' )
                .then((response) => {
                //update the state with the response data
                this.setState({
                    students : this.state.students.concat(response.data) 
                });
            });
    }

    viewProfile(id){
        console.log('View Profile please')
        this.setState({ redirect: `/studentprofile/${id}` });
    }

    render(){
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
            }
       // console.log(this.state.students)
        //iterate over books to create a table row
        let details = this.state.students.map(student => {
            return(
                <div className="row" key = {student.student_id}>	
				<div className="well" style ={{height:'190px',width:'80%'}}>
                <h3>{student.first_name}, {student.last_name}</h3>
                        <p><span style = {{fontWeight:'bold'}}>Major: </span>{student.major}</p> 
                        <p> <span style = {{fontWeight:'bold'}}>College: </span>   {student.college_name}</p> 
                        <p><span style = {{fontWeight:'bold'}}>Skills: </span>   {student.skills}
                        <button  style = {{float :'right',width :'100px',height:'30px'}} onClick = {(e)=>this.viewProfile(student.student_id)}> View Profile</button>
                        </p>
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
            <div style ={{marginLeft:'50px'}}>
                {redirectVar}
                
			    <div className="col-sm-8" >
                    <h2>List of All Students</h2>
                        
                            <div>
                             {details}
                            </div>
               
                </div>
                <div className="col-sm-3" style ={{marginTop:'60px'}}>
				
				<div className="well">
					<h3>Search
                    </h3>
					<div  className="form-group" >
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" onChange = {(e)=>this.changeHandler(e,"first_name")} placeholder = "First Name" defaultValue =''/>
                        <p></p>
                        <select style = {{width:'90%',height:'25px'}} onChange = {(e)=>this.changeHandler(e,"major")} placeholder = "Major" defaultValue =''>
                        <option value="" disabled >Major</option>
                      <option value="Software Engineering">Software Engineering</option>
                     <option value="Computer Engineering">Computer Engineering</option>
                     <option value="Data Analytics">Data Analytics</option>
                     <option value="Electrical Engineering">Electrical Engineering</option>
                         </select>
                        <p></p>
                        <select style = {{width:'90%',height:'25px'}} onChange = {(e)=>this.changeHandler(e,"college_name")} placeholder = "College Name" defaultValue ='' >
                        <option value="" disabled >College</option>
                        <option value="SJSU">SJSU</option>
                        <option value="UFL">UFL</option>
                        <option value="UTD">UTD</option>
                        <option value="Stanford">Stanford</option>
                        </select>
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" onChange = {(e)=>this.changeHandler(e,"skills")} placeholder = "Skills" defaultValue =''/>
                        <button onClick= {(e)=>this.searchHandler()}  disabled = {!this.state.searchEnabled} style = {{width:'75px'}}>Search</button>
                    <button onClick= {(e)=>this.cancelHandler()}  style = {{width:'75px',marginLeft:'5px'}}>Reset</button>
                     </div>
            	</div>
                </div>
            </div> 
        )
    }
}
//export Home Component
export default Students;