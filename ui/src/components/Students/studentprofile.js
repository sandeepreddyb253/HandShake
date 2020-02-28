import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { compareAsc, format } from 'date-fns'

class Profile extends Component {
    constructor(props){
        super(props);
        this.initialState = {  
            studentObject : [],
            studentExperience:[],
            stduentEducation:[],
            student_id : this.props.match.params.id,
        }
        this.state = this.initialState;
        
        
    }  

    

    componentDidMount(){
        console.log('+++++')
        axios.get('http://localhost:8080/profile/'+ this.state.student_id)
                .then((response) => {
                console.log()
                this.setState({
                    studentObject : this.state.studentObject.concat(response.data.studentObject),
                    studentExperience : this.state.studentExperience.concat(response.data.studentExperience),
                    stduentEducation : this.state.stduentEducation.concat(response.data.stduentEducation)
                });
            });
            
    }

    render(){
        
        //if not logged in go to login page
        
        let contactDetails =  this.state.studentObject.map(obj => {
            return(
                <div key ={obj.email}>
				
					<p style = {{fontWeight: 'bold'}}>Email:</p>
                    <p> {obj.email}</p>
					<p style = {{fontWeight: 'bold'}}>PhoneNo:</p>
					<p> {obj.phone_no}</p>
                     <p style = {{fontWeight: 'bold'}}>Date Of Birth:</p>
                    <p>{obj.dob}</p>  
				</div>  
        )
        })

        let basicDetails = this.state.studentObject.map(obj=>{
            return (
                <div key = {obj.student_id} >
                    <img style = {{width:'75%'}} src ={require("../Util/Handshake.jpg") }></img> 
                    
                    <p style = {{fontWeight: 'bold'}}>First Name:</p>
                    <p>{obj.first_name}</p>
                    
                     <p style = {{fontWeight: 'bold'}}>Last Name:</p>
                     <p>{obj.last_name}</p>
                
                    <p style = {{fontWeight: 'bold'}}>City:</p>
					<p>{obj.city}</p>
                    
                    <p style = {{fontWeight: 'bold'}}>Date Of Birth:</p>
					<p>{obj.dob}</p>
                     
                </div>
            )
        })

        let skills = this.state.studentObject.map(obj => {
            return (
            <div key ={obj.email}>
            <p>{obj.skills}</p>
            </div>
            )
        })
        
        let Objective = this.state.studentObject.map(obj=>{
            return(
                <div key ={obj.email}>
                <p>{obj.objective}</p> 
                </div>               
            )
        })



        let educationDetails = this.state.stduentEducation.map(obj=>{
            return(
                <div key ={obj.college}> 
					<p style ={{fontWeight: 'bold'}}>College:</p>
                    <p>{obj.college}</p>
                   <p style ={{fontWeight: 'bold'}}>Course:</p>
                    <p>{obj.course}</p>
					<p style ={{fontWeight: 'bold'}}>Expected graduation Date:</p>
					<p>{obj.grad_date}</p>
                    <hr
                        style={{
                         color: '#3333',
                         backgroundColor:'#3333',
                         borderRadius:'10px',
                         height: '3px'
                        }}/>
				</div>
            )
        })


        let expDetails = this.state.studentExperience.map(obj=>{
            return(
                <div  key = {obj.company}>
					<p style ={{fontWeight: 'bold'}}>Company:</p>
                    <p> {obj.company}</p>
                    
					<p style ={{fontWeight: 'bold'}}>Positon:</p>
                    <p> {obj.postion}</p>
					<p style ={{fontWeight: 'bold'}}>Description:</p>
                    <p> {obj.work_desc}</p>
        
                
                    <p style ={{fontWeight: 'bold'}}><span style={{marginRight:'210px'}}>Location:</span> <span style={{marginRight:'190px'}}> Start Date:</span>     <span>    End Date:</span></p>
                        <p >
                        <span  style ={{marginRight:'210px'}}>{obj.work_location}</span> 
                        <span  style ={{marginRight:'210px'}}>2019-08-13</span> 
                        <span  style ={{marginRight:'210px'}}>2020-12-12</span> 
                        </p>
                    
                    <hr style={{ color: '#3333',backgroundColor:'#3333',borderRadius:'10px', height: '3px' }} />
                    </div>
            )
        })
        
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
            
        }
        

        return(
            <div style = {{marginLeft: '25px'}}>
                {redirectVar}
                <div className="row">
			<div className="col-sm-8" >
				
                <div className="well">
					<h3>Career Objective
                    </h3>
					{Objective}
				</div>

               
				<div className = "well">
					<h3>Educational Details
                    </h3>
        			{educationDetails}
                   </div>

				<div className = "well">
				
					<h3>Experience   
                      </h3>
                      {expDetails}
					</div>
                <div className = "well">
                    <h3> Additional Details 
                     </h3>
				{contactDetails}
              		</div>
            </div>
			<div className="col-sm-3">
				
				<div className="well">
					{/* <img src ={require("/profile.jpg")}></img> */}
					<h3>Basic Details</h3>
					{basicDetails}
				</div>

			</div>

            <div className="col-sm-3">
				
				<div className="well">
					<h3>Skills
                    </h3>
					{skills}
            	</div>

			</div>
		</div> 
            </div> 
        )
    }
}
//export Profile Component
export default Profile;