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
            redirect:'',
            collegeSearch:'',
            nameSearch:''
        }
        this.viewProfile = this.viewProfile.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
    }  

    changeHandler(e,type){
        if(type === "college"){
            this.setState({
                collegeSearch: e.target.value
            })
        }else if (type === "name"){
            this.setState({
                nameSearch: e.target.value
            })
        }
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
       // console.log(this.state.students)
        //iterate over books to create a table row
        let details = this.state.students.map(student => {
            return(
                <div className="row" key = {student.student_id}>	
				<div className="well" style ={{height:'175px',width:'80%'}}>
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
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" onChange = {(e)=>this.changeHandler(e,"college")} placeholder = "College Name" />
                        <p></p>
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" onChange = {(e)=>this.changeHandler(e,"name")} placeholder = "Student Name"/>
                     </div>
            	</div>
                </div>
            </div> 
        )
    }
}
//export Home Component
export default Students;