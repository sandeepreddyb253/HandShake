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
            isSkillsSaveEnabled :false
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

        this.deleteHandler = this.deleteHandler.bind(this);
    }  

    async  AddExperience(){
       // console.log("Add Experience",this.state.studentExperience)
        var newStudentExperience={
            company:'',
            fk_student_id:this.state.studentObject.student_id,
            postion:'',
            work_desc:'',
            work_location:'',
            from_date :'',
            to_date:''
        }
        await this.props.studentExperience?.concat(newStudentExperience)
      // console.log("xxx:",x)
        this.setState({
           // studentExperience : this.props.studentExperience?.concat(newStudentExperience),
            isExpSaveEnabled:true
        })
    }
    cancelHandler(){
        this.props.fetchProfile(1);
        this.setState(this.initialState)
        
        
    }
    deleteHandler(id,type){
        if(type === "Experience"){
            
            var  payload = id
            var response =  this.props.deleteExperience(payload)
           // console.log(response)
            this.setState({
                            isExpSaveEnabled:false
                        })
    }else if(type === "Education"){
       

        var  payload = id
            var response =  this.props.deleteEducation(payload)
           // console.log(response)
            this.setState({
                            isEduSaveEnabled:false
                        })
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
        }
    }


    AddEducation(){
        console.log("Add Experience",this.state.studentExperience)
        var newStudentEducation={
            college:'',
            fk_student_id:this.state.studentObject.student_id,
            course:'',
            grad_date:''
        }
        this.setState({
            stduentEducation : this.state.stduentEducation.concat(newStudentEducation),
            isEduSaveEnabled:true
        })
    }
    
    

    saveHandler(type){
        console.log("in save:::",type )
        if(type === "Experience"){
        console.log('Save these ',this.state.studentExperience)
       var  payload = this.props?.studentExperience
        var response =  this.props.saveExperience(payload)
        console.log(response)
        this.setState({
                        isExpSaveEnabled:false
                    })
                  
        }else if (type === "Education"){
            //console.log('Save Education', this.state.stduentEducation)
            var payload = this.props?.stduentEducation
            var response = this.props.saveEducation(payload)
            this.setState({
                        isEduSaveEnabled:false
                    })
                  
        }else if(type === "studentObject"){
           // console.log('Save Education', this.state.stduentEducation)

           var payload = this.props?.studentObject
           console.log('payload',payload)
            var response = this.props.saveStudentObject(payload)
            this.setState({
                isObjSaveEnabled:false,
                isContactSaveEnabled:false,
                isSkillsSaveEnabled :false
             })
             
        }
    }

    //get the books data from backend  
    componentDidMount(){
        var value = 1

        this.props.fetchProfile(value);
            
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
                     <p style = {{fontWeight: 'bold'}}>Date Of Birth:</p>
					
                    <div  className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isContactSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"dob","studentObject")} defaultValue = {obj.dob}/>
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
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isEduSaveEnabled} onChange = {(e)=>this.changeHandler(e,obj.student_education_id,"grad_date","education")} defaultValue = {obj.grad_date}/>
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

                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "text"  disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"from_date","experience")} defaultValue = {obj.from_date}/>

                        <input  style ={{width:'30%',borderRadius:'7px'}} type = "text"  disabled={!this.state.isExpSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_exp_id,"to_date","experience")} defaultValue = {obj.to_date}/>
                        
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
                    <button onClick= {(e)=>this.saveHandler("Education")} hidden = {!this.state.isEduSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isEduSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>

				<div className = "well">
				
					<h3>Experience   
                      
                       <button onClick= {this.AddExperience} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px',marginLeft:'5px'}} > Add</button>
                       <button onClick= {this.EditExperience} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
					{expDetails}
                    <button onClick= {(e)=>this.saveHandler("Experience")} disabled = {!this.state.isExpSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isExpSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
				</div>
                <div className = "well">
                    <h3> Additional Details 
                    <button onClick= {this.EditContactDetails} style = {{width:'45px',float:'right',height:'15px',fontSize:'12px'}} > Edit</button>
                    </h3>
				{contactDetails}
                <button onClick= {(e)=>this.saveHandler("studentObject")} hidden = {!this.state.isContactSaveEnabled} style = {{width:'75px'}}>Save</button>
                    <button onClick= {(e)=>this.cancelHandler()} hidden = {!this.state.isContactSaveEnabled} style = {{width:'75px',marginLeft:'5px'}}>Cancel</button>
			</div>
            </div>
			<div className="col-sm-3">
				
				<div className="well">
					{/* <img src ={require("/profile.jpg")}></img> */}
					<h3>Sandeep Reddy Bhimireddy</h3>
					<p>Student at SJSU</p>
					<p>Masters in Software Engineering</p>
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
    stduentEducation : state.profile.stduentEducation
   });
   
//export Profile Component
export default connect (mapStateToProps,{fetchProfile,saveExperience,saveEducation, saveStudentObject,deleteEducation,deleteExperience})(Profile);