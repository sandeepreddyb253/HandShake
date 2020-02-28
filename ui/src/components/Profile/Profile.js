import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { compareAsc, format } from 'date-fns';
import {fetchProfile,saveExperience,saveEducation, saveStudentObject, deleteExperience, deleteEducation} from '../../ReduxModules/actions/index';
import {connect} from 'react-redux';

class Profile extends Component {
    constructor(){
        super();
        this.initialState = {  
            studentObject : [],
            studentExperience:[],
            stduentEducation:[],
            isExpSaveEnabled : false,
            isEduSaveEnabled:false,
            isObjSaveEnabled:false,
            isContactSaveEnabled : false,
            isSkillsSaveEnabled :false,
            isBasicSaveEnabled: false,
            isEduAddEnabled:false,
            isExpAddEnabled:false,
            newStudentEducation:[],
            newStudentExperience:[]
        }
        this.state = this.initialState;
        
        this.saveHandler = this.saveHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.cancelHandler = this.cancelHandler.bind(this);

        this.AddExperience = this.AddExperience.bind(this);
        this.EditExperience = this.EditExperience.bind(this);
        
        
        this.AddEducation = this.AddEducation.bind(this);
        this.EditEducation = this.EditEducation.bind(this);

        this.EditObjective = this.EditObjective.bind(this);
        this.EditContactDetails = this.EditContactDetails.bind(this);
        this.EditSkills = this.EditSkills.bind(this);
        this.EditBasicDetails = this.EditBasicDetails.bind(this)

        this.deleteHandler = this.deleteHandler.bind(this);
    }  

      AddExperience(){
        this.setState({
           // studentExperience : this.props.studentExperience?.concat(newStudentExperience),
            isExpSaveEnabled:true,
            isExpAddEnabled:true
        })
    }
    cancelHandler(){
        this.props.fetchProfile(cookie.load('cookie'));
        this.setState(this.initialState)
        
        
    }
   async deleteHandler(id,type){
        if(type === "Experience"){
            
            var  payload = id
            var response = await this.props.deleteExperience(payload)
           // console.log(response)
            this.setState({
                            isExpSaveEnabled:false
                        })
    }else if(type === "Education"){
       

        var  payload = id
            var response = await this.props.deleteEducation(payload)
           // console.log(response)
            this.setState({
                            isEduSaveEnabled:false
                        })
    }else if(type ==="newExperience" || type ==="newEducation"){
      await  this.props.fetchProfile(cookie.load('cookie'));
        this.setState(this.initialState)
    }
    }

    EditExperience(){
        this.setState({
            isExpSaveEnabled:true})
    }

    EditEducation(){
        this.setState({
            isEduSaveEnabled:true})
    }

    EditObjective(){
        this.setState({
            isObjSaveEnabled :true
        })
    }

    EditContactDetails(){
        this.setState({
            isContactSaveEnabled:true
        })
    }

    EditSkills(){
        this.setState({
            isSkillsSaveEnabled:true
        })
    }

    EditBasicDetails(){
        this.setState({
            isBasicSaveEnabled:true
        })
    }

    changeHandler(e, id, name, type) {
        if (type === "education") {
            const studentEdu = this.props?.stduentEducation;

            studentEdu.map((edu) => {
                if (edu.student_education_id === id) {
                    edu[name] = e.target.value;
                }

            })
        } else if (type === "experience") {
            const studentExper = this.props?.studentExperience;

            studentExper.map((exp) => {
                if (exp.student_exp_id === id) {
                    exp[name] = e.target.value;
                    console.log(e.target.value);
                }
            })
        }else if (type === "studentObject"){
            const studObj = this.props?.studentObject;
            console.log('in edit handler', studObj)
            studObj.map((obj)=>{
                if(obj.student_id ===id ){
                    obj[name] = e.target.value;
                    //console.log(e.target.value);
                }
            })
        }else if(type === "newEducation"){
            const studentEducation = this.state.newStudentEducation;
            studentEducation[name]= e.target.value;
            studentEducation.fk_student_id = this.props?.studentObject[0].student_id;
            console.log(this.state.newStudentEducation)
            this.setState({
                newStudentEducation:studentEducation
            })
        }else if(type ==="newExperience"){
            const studentExp = this.state.newStudentExperience;
            studentExp[name]= e.target.value;
            studentExp.fk_student_id = this.props?.studentObject[0].student_id;
            console.log(this.props?.studentObject[0].student_id)
            this.setState({
                newStudentExperience:studentExp
            })
        }
    }


    AddEducation(){
        console.log("Add Experience",this.state.studentExperience)
        
        this.setState({
           // stduentEducation : this.state.stduentEducation.concat(newStudentEducation),
            isEduSaveEnabled:true,
            isEduAddEnabled:true
        })
    }
    
    

    async saveHandler(type){
        console.log("in save:::",type )
        if (type === "Experience") {
            console.log('Save these ', this.state.studentExperience)
            var payload = this.props?.studentExperience
            var newStudentExperience = {
                company: this.state.newStudentExperience.company,
                work_desc: this.state.newStudentExperience.work_desc,
                work_location: this.state.newStudentExperience.work_location,
                fk_student_id: this.state.newStudentExperience.fk_student_id,
                postion: this.state.newStudentExperience.postion,
                from_date: this.state.newStudentExperience.from_date,
                to_date: this.state.newStudentExperience.to_date,
            }
            if (this.state.isExpAddEnabled) {
                console.log('state:', this.state)
                payload = payload.concat(newStudentExperience);
                console.log('edited payload', payload);
            }
            var response = await this.props.saveExperience(payload)
            console.log(response)
            this.setState({
                isExpSaveEnabled: false
            })

        }else if (type === "Education"){
            var payload = await this.props?.stduentEducation
            console.log('initial Payload Education', payload)
            var newStudentEducation = {
                college:this.state.newStudentEducation.college,
                course:this.state.newStudentEducation.course,
                grad_date:this.state.newStudentEducation.grad_date,
                fk_student_id: this.state.newStudentEducation.fk_student_id
            }
            if(this.state.isEduAddEnabled){
            console.log('state:',this.state)
            payload = payload.concat(newStudentEducation);
            console.log('edited payload',payload);
            }
           
            var response = await this.props.saveEducation(payload)
            this.setState({
                        isEduSaveEnabled:false,
                        isEduAddEnabled:false
                    })
                  
        }else if(type === "studentObject"){
           // console.log('Save Education', this.state.stduentEducation)

           var payload = this.props?.studentObject
           console.log('payload in studentObject',payload)
            var response = await this.props.saveStudentObject(payload)
            console.log('response in studentObject',response)
            this.setState({
                isObjSaveEnabled:false,
                isContactSaveEnabled:false,
                isSkillsSaveEnabled :false,
                isBasicSaveEnabled:false
             })
             
        }
    }

    //get the books data from backend  
    async componentDidMount(){
        var value = cookie.load('cookie')

        await this.props.fetchProfile(value);
            
    }

    render(){
        
        //if not logged in go to login page
        
        let contactDetails =  this.props.studentObject?.map(obj => {
            return(
                <div key ={obj.email}>
				
					<p style = {{fontWeight: 'bold'}}>Email:</p>
					
                    <div  className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isContactSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"email","studentObject")} defaultValue = {obj.email}/>
                     </div>
					<p style = {{fontWeight: 'bold'}}>PhoneNo:</p>
					
                    <div  className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isContactSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"phone_no","studentObject")} defaultValue = {obj.phone_no}/>
                     </div>
				</div>  
        )
        })

        let skills = this.props.studentObject?.map(obj => {
            return (
                <div key = {obj.email}>
                    <div  className="form-group">
                        <textarea  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isSkillsSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"skills","studentObject")} defaultValue = {obj.skills}/>
                     </div>
                </div>
            )
        })
        
        let Objective = this.props.studentObject?.map(obj=>{
            return(
                <div key ={obj.objective} className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isObjSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"objective","studentObject")} defaultValue = {obj.objective}/>
                </div>
            )
        })


        let basicDetails = this.props.studentObject?.map(obj=>{
            return (
                <div key = {obj.student_id} className = "form-group">
                    <img style = {{width:'75%'}} src ={require("../Util/Handshake.jpg") }></img> 
                    
                    <p style = {{fontWeight: 'bold'}}>First Name:</p>
					
                    <div  className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isBasicSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"first_name","studentObject")} defaultValue = {obj.first_name}/>
                     </div>
                     <p style = {{fontWeight: 'bold'}}>Last Name:</p>
					
                    <div  className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isBasicSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"last_name","studentObject")} defaultValue = {obj.last_name}/>
                     </div>
                    <p style = {{fontWeight: 'bold'}}>City:</p>
					
                    <div  className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isBasicSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"city","studentObject")} defaultValue = {obj.city}/>
                     </div>
                    <p style = {{fontWeight: 'bold'}}>Date Of Birth:</p>
					
                    <div  className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "date" disabled={!this.state.isBasicSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"dob","studentObject")} defaultValue = {obj.dob}/>
                     </div>
                     
                </div>
            )
        })

        var eduForm = null;
        if(this.state.isEduAddEnabled){
            eduForm =  (
            <div>
            <p style ={{fontWeight: 'bold'}}>College:</p>
            <div className="form-group">
                <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isEduSaveEnabled} onChange = {(e)=>this.changeHandler(e,undefined,"college","newEducation")} defaultValue = ''/>
            </div>
            <p style ={{fontWeight: 'bold'}}>Course:</p>
            
             <div className="form-group">
                <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isEduSaveEnabled} onChange = {(e)=>this.changeHandler(e,undefined,"course","newEducation")} defaultValue = ''/>
            </div>
            <p style ={{fontWeight: 'bold'}}>Expected graduation Date:</p>
            
            <div className="form-group">
                <input  style ={{width:'90%',borderRadius:'7px'}} type = "date" disabled={!this.state.isEduSaveEnabled} onChange = {(e)=>this.changeHandler(e,undefined,"grad_date","newEducation")} defaultValue = ''/>
            </div>
            <button onClick= {(e)=>this.deleteHandler(undefined,"newEducation")} hidden = {!this.state.isEduSaveEnabled} style = {{width:'75px',float:'right',marginTop:'40px'}}>Delete</button>
            <hr
                style={{
                 color: '#3333',
                 backgroundColor:'#3333',
                 borderRadius:'10px',
                 height: '3px'
                }}/>
                </div>
                )
        }
        let educationDetails = this.props.stduentEducation?.map(obj=>{
            return(
                <div key ={obj.college}> 
					<p style ={{fontWeight: 'bold'}}>College:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isEduSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.student_education_id,"college","education")} defaultValue = {obj.college}/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Course:</p>
                    
                     <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isEduSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.student_education_id,"course","education")} defaultValue = {obj.course}/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Expected graduation Date:</p>
					
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "date" disabled={!this.state.isEduSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.student_education_id,"grad_date","education")} defaultValue = {obj.grad_date}/>
                    </div>
                    <button onClick= {(e)=>this.deleteHandler(obj.student_education_id,"Education")} hidden = {!this.state.isEduSaveEnabled} style = {{width:'75px',float:'right',marginTop:'40px'}}>Delete</button>
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

        let expForm = null;
        if(this.state.isExpAddEnabled){
           expForm = (
               <div>
                    <p style ={{fontWeight: 'bold'}}>Company:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isExpSaveEnabled} onChange = {(e)=>this.changeHandler(e,undefined,"company","newExperience")} defaultValue = ''/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Positon:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}}  type = "text" disabled={!this.state.isExpSaveEnabled} onChange = {(e)=>this.changeHandler(e,undefined,"postion","newExperience")} defaultValue = ''/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Description:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,undefined,"work_desc","newExperience")} defaultValue = ''/>
                    </div>

                    <div className="form-group">
                    <p style ={{fontWeight: 'bold'}}><span style={{marginRight:'210px'}}>Location:</span> <span style={{marginRight:'190px'}}> Start Date:</span>     <span>    End Date:</span></p>
                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "text" disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,undefined,"work_location","newExperience")} defaultValue = ''/>

                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "date"  disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,undefined,"from_date","newExperience")} defaultValue = ''/>

                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "date"  disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,undefined,"to_date","newExperience")} defaultValue = ''/>
                        
                    </div>
                    <button onClick= {(e)=>this.deleteHandler(undefined,"newExperience")} hidden = {!this.state.isExpSaveEnabled} style = {{width:'75px',float:'right',marginTop:'40px'}}>Delete</button>
                    <hr style={{ color: '#3333',backgroundColor:'#3333',borderRadius:'10px', height: '3px' }} />
                    </div>
           )
        }

        
        let expDetails = this.props.studentExperience?.map(obj=>{
           // console.log('student Experience:' ,this.props.studentExperience)
            return(
               <div  key = {obj.company}>
					<p style ={{fontWeight: 'bold'}}>Company:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isExpSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"company","experience")} defaultValue = {obj.company}/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Positon:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}}  type = "text" disabled={!this.state.isExpSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"postion","experience")} defaultValue = {obj.postion}/>
                    </div>
					<p style ={{fontWeight: 'bold'}}>Description:</p>
                    <div className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"work_desc","experience")} defaultValue = {obj.work_desc}/>
                    </div>

                    <div className="form-group">
                    <p style ={{fontWeight: 'bold'}}><span style={{marginRight:'210px'}}>Location:</span> <span style={{marginRight:'190px'}}> Start Date:</span>     <span>    End Date:</span></p>
                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "text" disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"work_location","experience")} defaultValue = {obj.work_location}/>

                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "date"  disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"from_date","experience")} defaultValue = {obj.from_date}/>

                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "date"  disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"to_date","experience")} defaultValue = {obj.to_date}/>
                        
                    </div>
                    <button onClick= {(e)=>this.deleteHandler(obj.student_exp_id,"Experience")} hidden = {!this.state.isExpSaveEnabled} style = {{width:'75px',float:'right',marginTop:'40px'}}>Delete</button>
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
                    <button onClick= {this.EditObjective} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
					{Objective}
                    <button onClick= {(e)=>this.saveHandler("studentObject")} hidden = {!this.state.isObjSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isObjSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>

               
				<div className = "well">
					<h3>Educational Details
                 <button onClick= {this.AddEducation} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px',marginLeft:'5px'}} > Add</button> 
                    <button onClick= {this.EditEducation} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
        			{educationDetails}
                    {eduForm}
                    <button onClick= {(e)=>this.saveHandler("Education")} hidden = {!this.state.isEduSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isEduSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>

				<div className = "well">
				
					<h3>Experience   
                      
                       <button onClick= {this.AddExperience} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px',marginLeft:'5px'}} > Add</button>
                       <button onClick= {this.EditExperience} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
					{expDetails}
                    {expForm}
                    <button onClick= {(e)=>this.saveHandler("Experience")} hidden = {!this.state.isExpSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isExpSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>
                <div className = "well">
                    <h3> Contact Details 
                    <button onClick= {this.EditContactDetails} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
				{contactDetails}
                <button onClick= {(e)=>this.saveHandler("studentObject")} hidden = {!this.state.isContactSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isContactSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
			</div>
            </div>
			<div className="col-sm-3">
				
				<div className="well"><h3> Basic Details
                <button onClick= {this.EditBasicDetails} style = {{width:'45px',float:'right',height:'20px',fontSize:'12px'}} > Edit</button>
                </h3>
                 {basicDetails}
                 <button onClick= {(e)=>this.saveHandler("studentObject")} hidden = {!this.state.isBasicSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isBasicSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>

			</div>

            <div className="col-sm-3">
				
				<div className="well">
					<h3>Skills
                    <button onClick= {this.EditSkills} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
					{skills}
                    <button onClick= {(e)=>this.saveHandler("studentObject")} hidden = {!this.state.isSkillsSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isSkillsSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>

			</div>
		</div> 
            </div> 
        )
    }
}

const mapStateToProps = state => ({
    studentObject : state.profile.studentObject,
    studentExperience: state.profile.studentExperience,
    stduentEducation : state.profile.stduentEducation,
   // response: state.profile.
   });
   
//export Profile Component
export default connect (mapStateToProps,{fetchProfile,saveExperience,saveEducation, saveStudentObject,deleteEducation,deleteExperience})(Profile);