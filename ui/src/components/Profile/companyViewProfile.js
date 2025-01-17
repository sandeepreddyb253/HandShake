import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import TextareaAutosize from 'react-textarea-autosize';
import {backend} from '../../webConfig'

class companyViewProfile extends Component {
    constructor(props){
        super(props);
        this.initialState = {  
            companyObject : [],
            company_id : this.props.match.params.id
        }
        this.state = this.initialState;
        
        
    }  

    buildAvatarUrl = fileName => {
        console.log('Building Avatar')
        return backend+"file/" + fileName+'/?role=company';
    };
    
    
    componentDidMount(){
        var data = this.state.company_id
        axios.get(backend+'companyProfile/'+data)
                .then((response) => {
                console.log()
                this.setState({
                    companyObject : this.state.companyObject.concat(response.data),
                });
            });
            
    }

    render(){
        
        //if not logged in go to login page
        let contactDetails = this.state.companyObject.map(obj => {
            return(
                <div key ={obj.company_id}>
                <p style ={{fontWeight: 'bold'}}>Email:</p>
                <p>{obj.email}</p>
                
                <p style ={{fontWeight: 'bold'}}>Phone No:</p>
                <p>{obj.phone_no}</p>
                
                
                </div>
            )
        })
        
        let companyDetails =  this.state.companyObject.map(obj => {
            return(
                <div key ={obj.company_id}> 
                <p style ={{fontWeight: 'bold'}}>Company Name:</p>
                <p>{obj.company_name}</p>
                <p style ={{fontWeight: 'bold'}}>Description:</p>
                <TextareaAutosize disabled = "true" value = {obj.company_desc} /> 
                <p style ={{fontWeight: 'bold'}}>City:</p>
                <p>{obj.city}</p>
                <p style ={{fontWeight: 'bold'}}>State:</p>
                <p>{obj.state}</p>
                <p style ={{fontWeight: 'bold'}}>Country:</p>
                <p>{obj.country}</p> 
                </div>

        )
        })
        
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
            
        }

        let profilePic =  this.state.companyObject?.map(obj=>{
            if(obj.profile_path){
                return(<div className="wrapper">
                <img src={this.buildAvatarUrl(obj.profile_path)} className="image--cover"></img>
                </div>
                )
            } else{
                return(
                 <div className="wrapper">
                 <img src={require("../Util/Handshake.jpg")} className="image--cover"></img>
                 </div>
                 )
            }
        })
        
        let imageDetails =  this.state.companyObject.map(obj => {
            return(
               <div key ={obj.company_id}> 
                {profilePic}
             
                </div>
            )})
        

        return(
            <div>
                 <img style = {{height:'250px',marginTop:'-20px',width:'100%'}} src ={require("../Util/company.jpg")}></img>
            <div style = {{marginLeft: '25px'}}>
                {redirectVar}
                <div className="row">
			<div className="col-sm-8" >
				
                <div className="well">
					<h3>Company Profile
                    </h3>
					{companyDetails}
                  	</div>

			</div>
			<div className="col-sm-3">
				
				<div className="well" style = {{height:'225px'}}>
					 {imageDetails} 
					
				</div>

			</div>
            <div className="col-sm-3">
				
            <div className="well">
					<h2>contactDetails
                    </h2>
					{contactDetails}
                    
				</div>
            </div>
            
		</div> 
            </div> 
            </div>
        )
    }
}
//export Profile Component
export default companyViewProfile;