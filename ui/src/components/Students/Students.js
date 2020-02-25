import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Popup from "reactjs-popup";


class Students extends Component {
    constructor(){
        super();
        this.state = {  
            students : [],
            redirect:''
        }
        this.viewProfile = this.viewProfile.bind(this)
    }  
    //get the books data from backend  
    componentDidMount(){
        axios.get('http://localhost:8080/getAllStudents')
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
        console.log(this.state.students)
        //iterate over books to create a table row
        let details = this.state.students.map(student => {
            return(
                <div className="row" key = {student.student_id}>	
				<div className="well" style ={{height:'175px',width:'70%'}}>
            <h3>{student.first_name}, {student.last_name}</h3>
                        <p><span style = {{fontWeight:'bold'}}>Objective: </span>{student.objective}</p> 
                        <p> <span style = {{fontWeight:'bold'}}>College: </span>   {student.college_name} 
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
            <div>
                {redirectVar}
                <div className="container">
                    <h2>List of All Students</h2>
                        
                            <div>
                             {details}
                            </div>
                </div> 
            </div> 
        )
    }
}
//export Home Component
export default Students;