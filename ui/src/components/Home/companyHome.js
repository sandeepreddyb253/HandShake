import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { compareAsc, format } from 'date-fns'

class companyHome extends Component {
    constructor(){
        super();
        this.initialState = {  
            jobPostings : [],
            redirect :'',
            studentExperience:[],
            stduentEducation:[],
            isJobSaveEnabled : false
        }
        this.state = this.initialState;
        
        this.saveHandler = this.saveHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);

        this.AddJob = this.AddJob.bind(this);
        this.EditHandler = this.EditHandler.bind(this);
        this.viewStudents = this.viewStudents.bind(this);
        
        
        
    }  

    viewStudents(id){
        this.setState({ redirect: `/jobStudents/${id}` });
    }

    AddJob(){
        console.log("Add Experience",this.state.jobPostings)
        var newjob={
            postion:'',
            job_desc:'',
            fk_company_id:cookie.load('cookie').split(':')[1],
            job_long_desc:'',
            job_long_desc2:'',
            job_long_dec3:'',
            skills_required :'',
            job_location:'',
            deadline:'',
            category:'',
            isSaveEnabled:true
        }
        this.setState({
            jobPostings : this.state.jobPostings.concat(newjob)
        })
    }
    cancelHandler(e,id){
        var data = cookie.load('cookie').split(':')[1]
        this.setState(this.initialState)
        axios.get('http://localhost:8080/companyJobPostings/'+data)
                .then((response) => {
                //update the state with the response data
                this.setState({
                    jobPostings : this.state.jobPostings.concat(response.data)
                });
            });
        
    }
    
    EditHandler(e,id){
        const jobs = this.state.jobPostings;

        jobs.map((job) => {
            if (job.job_id === id) {
                job.isSaveEnabled = true;
            }

        })
        this.setState({
            jobPostings: jobs 
        })
    }



    changeHandler(e, id, name, ) {
    const jobs = this.state.jobPostings;
    
    jobs.map((job) => {
                if (job.job_id === id) {
                    job[name] = e.target.value;
                    console.log(e.target.value)
                }

            })
            this.setState({
                jobPostings: jobs
            })
    }


    
    

   async saveHandler(e,id){

    const jobs = this.state.jobPostings;
    var data ;
    jobs.map((job) => {
        console.log('job id', job.job_id, '   id::',id)
                if (job.job_id === id) {
                console.log('Match found')
                data = job;
                job.isSaveEnabled = false
                }

            })
    console.log('data in save handler', data)        
   await axios.put('http://localhost:8080/saveJobs/', data)
              .then((response)=>{
                  console.log(response.status)
                  if(response.status === 200){
                    this.setState({
                        jobPostings  :jobs
                    }
                    )
                  }
              });
    }

    //get the books data from backend  
    componentDidMount(){
        if(cookie.load('cookie')){
        var data = cookie.load('cookie').split(':')[1]
        console.log(data)
        axios.get('http://localhost:8080/companyJobPostings/'+data)
        .then((response) => {
        this.setState({
            jobPostings : this.state.jobPostings.concat(response.data)
        });
    });
    }
    }

    render(){

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
            }
        
        
        let jobDetails = this.state.jobPostings.map(obj=>{
            return(
                <div key ={obj.job_id} className = "well"> 

					<p style ={{fontWeight: 'bold'}}>Position:
                    <button onClick= {(e)=>this.EditHandler(e,obj.job_id)} style = {{width:'45px',float:'right',height:'19px',fontSize:'12px'}} > Edit</button></p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"postion")} defaultValue = {obj.postion}/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Job Desc:</p>
                    
                     <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"job_desc")} defaultValue = {obj.job_desc}/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Extra Description:</p>
					
                    <div className="form-group">
                        <textarea  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"job_long_desc")} defaultValue = {obj.job_long_desc}/>
                    </div>
                    <p style ={{fontWeight: 'bold'}}>Additional Details:</p>
					
                    <div className="form-group">
                        <textarea  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"job_long_desc2")} defaultValue = {obj.job_long_desc2}/>
                    </div>
                    <p style ={{fontWeight: 'bold'}}>Salary Details:</p>
					
                    <div className="form-group">
                        <textarea  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"job_long_dec3")} defaultValue = {obj.job_long_dec3}/>
                    </div>
                    <p style ={{fontWeight: 'bold'}}>Skills Required:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"skills_required")} defaultValue = {obj.skills_required}/>
                    </div>
                    <p style ={{fontWeight: 'bold'}}>Category:</p>
                    <select style = {{width:'300px',height:'50px',marginBottom:'15px'}} disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"category")} defaultValue = {obj.category}>
                      <option value="Full Time">Full Time</option>
                     <option value="Part Time">Part Time</option>
                     <option value="On Campus">On Campus</option>
                     <option value="Internship">Internship</option>
                         </select>
                    <p style ={{fontWeight: 'bold'}}>Job Location:</p>
                    <select style = {{width:'300px',height:'50px',marginBottom:'15px'}} disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"job_location")} defaultValue = {obj.job_location} >
                        <option value="" disabled >Job Location</option>
                        <option value="San Jose">San Jose</option>
                        <option value="Palo Alto">Palo Alto</option>
                        <option value="San Fransisco">San Fransisco</option>
                        <option value="Santa Clara">Santa Clara</option>
                        <option value="Freemont">Freemont</option>
                        </select>
                    <p style ={{fontWeight: 'bold'}}>Deadline:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!obj.isSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.job_id,"deadline")} defaultValue = {obj.deadline}/>
                         <button onClick= {(e)=>this.viewStudents(obj.job_id)}  style = {{width:'75px',float:'right'}}>Students</button> 
                    </div>
                    <button onClick= {(e)=>this.saveHandler(e,obj.job_id)} hidden = {!obj.isSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler(obj.job_id)} hidden = {!obj.isSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
                    
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
					<h3>Job Postings 
                 <button onClick= {this.AddJob} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px',marginLeft:'5px'}} > Add</button> 
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
export default companyHome;