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
            jobs : []
        }
        this.saveApplication = this.saveApplication.bind(this)
    }  
    //get the books data from backend  
    componentDidMount(){
        var data = '1'
        axios.get('http://localhost:8080/home/'+ data)
                .then((response) => {
                //update the state with the response data
                this.setState({
                    jobs : this.state.jobs.concat(response.data) 
                });
            });
    }

    saveApplication(job_id){
        const data = {
         jobId : job_id,
         studentId : 1
        }

        axios.post('http://localhost:8080/saveApplication',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log('Done')
            }else{
                console.log('Error in saving application');
            }
        });

    }

    render(){
        
        //console.log(this.state.jobs)
        //iterate over books to create a table row
        let details = this.state.jobs.map(job => {
            return(
                <div className="row" key = {job.postion}>
                <div className = "well" style = {{height:'175px',width:'60%'}}>
				<div className="col-sm-8" style ={{width:'80%'}}>
						<h3>{job.postion}</h3>
                        <p> {job.job_desc}, {job.job_location} </p>
                         <button  style = {{float :'left',width :'65px',height:'30px'}} disabled = {job.disable} onClick = {(e)=>this.saveApplication(job.job_id)}> {job.status}</button>
                        
				</div>
                <div className = "col-sm-3" style ={{width:'20%'}}>
                <img style = {{width:'100%',marginTop:'20px',marginBottom:'20px'}} src ={require("../Util/Handshake.jpg") }></img> 
                <Popup trigger={<a style = {{marginTop:'20px',align:'center'}}>Description </a>}
                         modal
                    closeOnDocumentClick>
            <div> {job.job_long_desc} </div>
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
                <div className="container">
                    <h2>List of All jobs</h2>
                        
                            <div>
                             {details}
                            </div>
                </div> 
            </div> 
        )
    }
}
//export Home Component
export default Home;