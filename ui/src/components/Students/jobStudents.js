import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { compareAsc, format } from 'date-fns'

class jobStudents extends Component {
    constructor(props){
        super(props);
        this.initialState = {  
            students : [],
            redirect:'',
            job_id : this.props.match.params.id,
        }
        this.state = this.initialState;
        this.changeHandler = this.changeHandler.bind(this)
        this.viewProfile = this.viewProfile.bind(this)
        this.changeStatus = this.changeStatus.bind(this)
        
    }  

    changeHandler(e,id,name){
        const students = this.state.students

        students.map((student)=>{
            if(student.map_application_id === id){
                student[name] = e.target.value;
            }
        })
    }

    async changeStatus(id){
        const students = this.state.students
        var studentData
        students.map((student)=>{
            if(student.map_application_id === id){
                studentData = student;
            }
        })
       await axios.put('http://localhost:8080/updateJobStatus',studentData)
        .then((response) => {
        console.log(response)
        if(response.status === 200){
            alert(response.data)
        }
        })
        .catch((error)=>{
            alert(error);
            console.log('error',error)
        })
    }

    componentDidMount(){
        //console.log('+++++')
        axios.get('http://localhost:8080/getJobStudents/'+this.state.job_id)
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
				<div className="well" style ={{height:'225px'}}>
                <h3>{student.first_name}, {student.last_name}</h3>
                        <p><span style = {{fontWeight:'bold'}}>Major: </span>{student.major}</p> 
                        <p> <span style = {{fontWeight:'bold'}}>College: </span>   {student.college_name}</p> 
                        <p><span style = {{fontWeight:'bold'}}>Skills: </span>   {student.skills}</p>
                       
                        <select style = {{width:'75%',height:'25px'}} onChange = {(e)=>this.changeHandler(e,student.map_application_id,"status")} placeholder = "College Name" defaultValue ={student.status} >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Declined">Declined</option>
                        <option value="Accepted">Accepted</option>
                        </select>
                        <button  style = {{float :'right',width :'100px',height:'30px',margin:'0px'}} onClick = {(e)=>this.viewProfile(student.student_id)}> View Profile</button>
                        <button  style = {{float :'right',width :'120px',height:'30px',margin:'0px',marginRight:'5px'}} onClick = {(e)=>this.changeStatus(student.student_id)}> Update Status</button>
                        
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
                
			    <div>
                    <h2>List of Applied Students</h2>
                        
                            <div style = {{width:'85%'}}>
                             {details}
                            </div>
               
                </div>
            </div>
            )
    }
}
//export Profile Component
export default jobStudents;