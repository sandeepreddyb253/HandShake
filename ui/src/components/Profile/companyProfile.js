import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import TextareaAutosize from 'react-textarea-autosize';


class companyProfile extends Component {
    constructor(){
        super();
        this.initialState = {  
            companyObject : [],
            isProfileSaveEnabled : false,
            isContactSaveEnabled:false,
            isPicSaveEnabled:false,
            picData:''
        }
        this.state = this.initialState;
        
        this.saveHandler = this.saveHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);
        this.EditHandler = this.EditHandler.bind(this);
        this.EditContactHandler = this.EditContactHandler.bind(this);
        this.EditPicHandler = this.EditPicHandler.bind(this);
    }  

    
    cancelHandler(){
        this.setState(this.initialState)
        var data = cookie.load('cookie').split(':')[1]
        axios.get('http://localhost:8080/companyProfile/'+data)
                .then((response) => {
                console.log()
                this.setState({
                    companyObject : this.state.companyObject.concat(response.data),
                    isProfileSaveEnabled :false,
                    isContactSaveEnabled : false,
                    isPicSaveEnabled:false
                });
            }); 
    }
    
    EditHandler(){
        this.setState({
            isProfileSaveEnabled:true})
    }
    EditContactHandler(){
        this.setState({
            isContactSaveEnabled:true})
    }
    EditPicHandler(){
        this.setState({
            isPicSaveEnabled:true,
            picData :"Edit image"
        })
    }

    changeHandler(e, id, name) {
        
            const companyProfile = this.state.companyObject;

            companyProfile.map((comp) => {
                if (comp.company_id === id) {
                    comp[name] = e.target.value;
                }

            })
            this.setState({
                companyObject: companyProfile
            })
          }


    
    
    

    saveHandler(type){
    
        console.log('Save these ',this.state.companyObject)

        axios.put('http://localhost:8080/companyProfile/:'+this.state.companyObject[0].company_id, this.state.companyObject)
              .then((response)=>{
                  console.log(response.status)
                  if(response.status === 200){
                    this.setState({
                        isProfileSaveEnabled:false,
                        isContactSaveEnabled:false
                    }
                    )
                  }
              });
        
    }

    //get the books data from backend  
    componentDidMount(){
        if(cookie.load('cookie')){
        var data = cookie.load('cookie').split(':')[1]
        axios.get('http://localhost:8080/companyProfile/'+data)
                .then((response) => {
                console.log()
                this.setState({
                    companyObject : this.state.companyObject.concat(response.data),
                });
            });
        }
            
    }
  
    render(){
        let contactDetails = this.state.companyObject.map(obj => {
            return(
                <div key ={obj.company_id}>
                <p style ={{fontWeight: 'bold'}}>Email:</p>
                
                <div className="form-group">
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isContactSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.company_id,"email")} defaultValue = {obj.email}/>
                </div>
                <p style ={{fontWeight: 'bold'}}>Phone No:</p>
                
                <div className="form-group">
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isContactSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.company_id,"phone_no")} defaultValue = {obj.phone_no}/>
                </div>
                
                </div>
            )
        })
       

        let companyDetails =  this.state.companyObject.map(obj => {
            return(
                <div key ={obj.company_id}> 
                <p style ={{fontWeight: 'bold'}}>Company Name:</p>
                <div className="form-group">
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isProfileSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.company_id,"company_name")} defaultValue = {obj.company_name}/>
                </div>
                <p style ={{fontWeight: 'bold'}}>Description:</p>
                
                 <div className="form-group">
                    <TextareaAutosize   style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isProfileSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.company_id,"company_desc")} defaultValue = {obj.company_desc}/>
                </div>
                <p style ={{fontWeight: 'bold'}}>City:</p>
                
                <div className="form-group">
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isProfileSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.company_id,"city")} defaultValue = {obj.city}/>
                </div>
                <p style ={{fontWeight: 'bold'}}>State:</p>
                
                <div className="form-group">
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isProfileSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.company_id,"state")} defaultValue = {obj.state}/>
                </div>
                <p style ={{fontWeight: 'bold'}}>Country:</p>
                
                <div className="form-group">
                    <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isProfileSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.company_id,"country")} defaultValue = {obj.country}/>
                </div>
            </div>

        )
        })
        
        let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
            
        }
        

        return(
            <div>
            <img style = {{height:'250px',marginTop:'-20px',width:'100%'}} src ={require("../Util/company.jpg")}></img>
            <div style = {{marginLeft: '25px'}}>
                {redirectVar}
                <div className="row">
                    
                
			<div className="col-sm-8" >
				
                <div className="well">
					<h3>Company Profile
                    <button onClick= {this.EditHandler} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
					{companyDetails}
                    <button onClick= {(e)=>this.saveHandler()} hidden = {!this.state.isProfileSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isProfileSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>

			</div>
			<div className="col-sm-3">
				
				<div className="well">
                <button onClick= {this.EditPicHandler} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
					 <img style = {{width:'75%'}} src ={require("../Util/Handshake.jpg")}></img> 
                <button onClick= {(e)=>this.saveHandler()} hidden = {!this.state.isPicSaveEnabled} style = {{width:'75px'}}>Save</button>
                <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isPicSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
					
				</div>

			</div>
            <div className="col-sm-3">
				
            <div className="well">
					<h2>contactDetails
                    <button onClick= {this.EditContactHandler} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h2>
					{contactDetails}
                    <button onClick= {(e)=>this.saveHandler()} hidden = {!this.state.isContactSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isContactSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>

			</div>

            
		</div> 
            </div> 
            </div>
        )
    }
}
//export Profile Component
export default companyProfile;