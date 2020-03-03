import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { compareAsc, format } from 'date-fns'

class companyViewProfile extends Component {
    constructor(props){
        super(props);
        this.initialState = {  
            companyObject : [],
            company_id : this.props.match.params.id
        }
        this.state = this.initialState;
        
        
    }  

    
    componentDidMount(){
        var data = this.state.company_id
        axios.get('http://localhost:8080/companyProfile/'+data)
                .then((response) => {
                console.log()
                this.setState({
                    companyObject : this.state.companyObject.concat(response.data),
                });
            });
            
    }

    render(){
        
        //if not logged in go to login page
        
        let companyDetails =  this.state.companyObject.map(obj => {
            return(
                <div key ={obj.company_id}> 
                <p style ={{fontWeight: 'bold'}}>Company Name:</p>
                <p>{obj.company_name}</p>
                <p style ={{fontWeight: 'bold'}}>Description:</p>
                <p>{obj.company_desc}</p> 
                 <p style ={{fontWeight: 'bold'}}>Email:</p>
                 <p>{obj.email}</p>
                <p style ={{fontWeight: 'bold'}}>Phone No:</p>
                <p>{obj.phone_no}</p>
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
        

        return(
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
				
				<div className="well">
					 <img style = {{width:'75%'}} src ={require("../Util/Handshake.jpg")}></img> 
					
				</div>

			</div>

            
		</div> 
            </div> 
        )
    }
}
//export Profile Component
export default companyViewProfile;