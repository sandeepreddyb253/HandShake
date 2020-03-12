import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { compareAsc, format } from 'date-fns'
import {backend} from '../../webConfig'

class eventStudents extends Component {
    constructor(props){
        super(props);
        this.initialState = {  
            students : [],
            redirect:'',
            event_id : this.props.match.params.id,
        }
        this.state = this.initialState;
        this.viewProfile = this.viewProfile.bind(this)
        
    }  

    

    

    componentDidMount(){
        console.log('+++++')
        axios.get(backend+'getEventStudents/'+this.state.event_id)
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
                       <button  style = {{float :'right',width :'100px',height:'30px',margin:'0px'}} onClick = {(e)=>this.viewProfile(student.student_id)}> View Profile</button>
                        
                        
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
                    <h2>List of Regsitered Students</h2>
                        
                            <div style = {{width:'85%'}}>
                             {details}
                            </div>
               
                </div>
            </div>
            )
    }
}
//export Profile Component
export default eventStudents;