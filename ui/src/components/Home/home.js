import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Popup from "reactjs-popup";


class Home extends Component {
    constructor(){
        super();
        this.state = {  
            jobs : [],
            redirect:'',
            searchObject:[],
            searchEnabled:false,
            fileData: null,
            openPopup:false
        }
        this.saveApplication = this.saveApplication.bind(this)
        this.viewProfile = this.viewProfile.bind(this)
        this.searchChangeHandler = this.searchChangeHandler.bind(this)
        this.searchHandler = this.searchHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.openPopup = this.openPopup.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }  
    //get the books data from backend  
   async componentDidMount(){
        if(cookie.load('cookie')){
        var data = cookie.load('cookie').split(':')[1]
       await axios.get('http://localhost:8080/home/'+data)       
         .then((response) => {
                //update the state with the response data
                this.setState({
                    jobs : this.state.jobs.concat(response.data) 
                });
            });
        }
    }
    openPopup(){
        console.log('Oepning popup')
        this.setState({
            openPopup :true
        })
    }
    closeModal(){
        console.log('closing popup')
        this.setState({
            openPopup :false
        })
    }
    onFileChange(e,id){
        let fileData = new FormData()
        console.log('fileData in state',this.state.fileData)
        fileData.append("file", e.target.files[0])
        console.log('fileData modified',fileData)
        this.setState({
            fileData : e.target.files[0],
            openPopup:true
          })
    }

    cancelHandler(){
        this.setState({
            jobs:[],
            searchHandler:false
        })
        if(cookie.load('cookie')){
            var data = cookie.load('cookie').split(':')[1]
            axios.get('http://localhost:8080/home/'+data)
                    .then((response) => {
                    //update the state with the response data
                    this.setState({
                        jobs : this.state.jobs.concat(response.data) 
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

    searchHandler(){
        var data = cookie.load('cookie').split(':')[1]
        axios.get('http://localhost:8080/home/'+data+'/?company_name='+this.state.searchObject.company_name+'&postion='+this.state.searchObject.postion+'&job_location='+this.state.searchObject.job_location+'&category='+this.state.searchObject.category)
                .then((response) => {
                this.setState({
                    jobs:[]
                });
                this.setState({
                    jobs : this.state.jobs.concat(response.data), 
                    searchEnabled:false
                });
            });
    }
    async saveApplication(job_id){
        const dataArray = new FormData() 
        dataArray.append("file", this.state.fileData)
        var studentId = cookie.load('cookie').split(':')[1]
        const jobs = this.state.jobs;
        jobs.map((job)=>{
        if(job.job_id === job_id){
            job.status = 'Applied'
            job.disable = 'true'
        }
    })
        var resumePath;
        console.log('JobId::',job_id)
        var uploadData ={
            dataArray:dataArray,
            
        }
        await axios.post('http://localhost:8080/uploadFile/?studentId='+studentId+'&jobId='+job_id+'&type=resume',dataArray)
        .then(response => {
            console.log("Status Code : ",response);
            if(response.status === 200){
                resumePath = response.data.path
                console.log('path:',resumePath)
            }
            else{
                console.log('Error in saving application');
            }
        });
        const data = {
            jobId : job_id,
            studentId : cookie.load('cookie').split(':')[1],
            resumePath:resumePath
           }
       await axios.post('http://localhost:8080/saveApplication',data)
        .then(response => {
            console.log("Status Code : ",response);
            if(response.status === 200){
                this.setState({
                    jobs:jobs,
                    fileData:'',
                    openPopup:false
                })
                alert('Applied Succesfully')
            }else{
                console.log('Error in saving application');
            }
        });

    }

    viewProfile(id){
        console.log('View Profile please')
        this.setState({ redirect: `/companyViewProfile/${id}` });
    }

    render(){
        console.log('open pop up flag',this.state.openPopup)
        if (this.state.redirect) {
            console.log('redirecting too')
            return <Redirect to={this.state.redirect} />;
            }
        
        
        //console.log(this.state.jobs)
        //iterate over books to create a table row
        let details = this.state.jobs.map(job => {
            return(
                <div className="row" key = {job.postion}>
                <div className = "well" style = {{height:'200px',width:'70%',marginLeft:'50px'}}>
				<div className="col-sm-8" style ={{width:'80%'}}>
						<h3>{job.postion}</h3>
                        <p> {job.job_desc}, {job.job_location} </p>
                         {/* <button  style = {{float :'left',width :'65px',height:'30px'}} disabled = {job.disable} onClick = {(e)=>this.saveApplication(job.job_id)}> {job.status}</button> */}
                         <p style = {{fontSize :'10px'}}>*Upload Resume for better chances of getting an interview call</p>
                         <input type="file" name="file" disabled = {job.disable} onChange={(e)=>this.onFileChange(e,job.job_id)} />
            <button type="submit" style = {{width:'75px'}} disabled = {job.disable} onClick = {(e)=>this.saveApplication(job.job_id)} >{job.status}</button>
                         {/* <Popup 
                        open = {this.state.openPopup}
                        trigger = {<button  style = {{float :'left',width :'65px',height:'30px'}}  disabled = {job.disable} onClick = {this.openPopup}>  {job.status}</button>}
                        closeOnDocumentClick
                        onClose={this.closeModal}
                        modal
                         >
                 
               <a className="close" onClick={this.closeModal}>
              &times;
                </a> 
               
                <h3>Upload Resume for better chances of getting hired !</h3>
                <input type="file" name="file" onChange={(e)=>this.onFileChange(e,job.job_id)} />
                <button type="submit" style = {{width:'75px'}} onClick = {(e)=>this.saveApplication(job.job_id)} >Submit</button>
                
                </Popup> */}
                
                        
				</div>
                <div className = "col-sm-3" style ={{width:'20%'}}>
                <img style = {{width:'100%',marginTop:'20px',marginBottom:'20px'}} src ={require("../Util/Handshake.jpg") }></img> 
                <Popup trigger={<a style = {{marginTop:'20px',align:'center'}}>Description </a>}
                         modal
                    closeOnDocumentClick>
                <div> <h2>Job Description</h2>
                   <p> {job.job_long_desc}</p>
                   <p>{job.job_long_desc2}</p>
                   <p>{job.job_long_dec3}</p>
                   <p style = {{fontWeight:'bold'}}>Skills Required:</p>
                    <p>{job.skills_required}</p>
                    <p style = {{fontWeight:'bold'}}>Deadline: </p>
                    <p>{job.deadline}</p>
                </div>
                </Popup>
                <button  style = {{float :'right',width :'100px',height:'30px'}} onClick = {(e)=>this.viewProfile(job.fk_company_id)}> {job.company_name}</button>
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
                <div className="col-sm-8" >
                    <h2 style = {{marginLeft:'50px'}}>List of All jobs</h2>
                        
                            <div>
                             {details}
                            </div>
                </div> 
                <div className="col-sm-3" style ={{marginTop:'60px'}}>
				
				<div className="well">
					<h3>Search
                    </h3>
					<div  className="form-group" >
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" onChange = {(e)=>this.searchChangeHandler(e,"company_name")} placeholder = "Company Name" defaultValue =''/>
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" onChange = {(e)=>this.searchChangeHandler(e,"postion")} placeholder = "Job Title" defaultValue =''/>
                        <p></p>
                        <select style = {{width:'90%',height:'25px'}} onChange = {(e)=>this.searchChangeHandler(e,"category")} placeholder = "Category" defaultValue =''>
                        <option value="" disabled >Category</option>
                      <option value="Full Time">Full Time</option>
                     <option value="Part Time">Part Time</option>
                     <option value="On Campus">On Campus</option>
                     <option value="Internship">Internship</option>
                         </select>
                        <p></p>
                        <select style = {{width:'90%',height:'25px'}} onChange = {(e)=>this.searchChangeHandler(e,"job_location")} placeholder = "Job Location" defaultValue ='' >
                        <option value="" disabled >Job Location</option>
                        <option value="San Jose">San Jose</option>
                        <option value="Palo Alto">Palo Alto</option>
                        <option value="San Fransisco">San Fransisco</option>
                        <option value="Santa Clara">Santa Clara</option>
                        <option value="Freemont">Freemont</option>
                        </select>
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
export default Home;