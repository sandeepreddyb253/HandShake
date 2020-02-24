import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import { compareAsc, format } from 'date-fns'

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
    }  

    AddExperience(){
        console.log("Add Experience",this.state.studentExperience)
        var newStudentExperience={
            company:'',
            fk_student_id:this.state.studentObject.student_id,
            postion:'',
            work_desc:'',
            work_location:'',
            from_date :'',
            to_date:''
        }
        this.setState({
            studentExperience : this.state.studentExperience.concat(newStudentExperience),
            isExpSaveEnabled:true
        })
    }
    cancelHandler(){
        this.setState(this.initialState)
        axios.get('http://localhost:8080/profile')
                .then((response) => {
                //update the state with the response data
                this.setState({
                    studentObject : this.state.studentObject.concat(response.data.studentObject),
                    studentExperience : this.state.studentExperience.concat(response.data.studentExperience),
                    stduentEducation : this.state.stduentEducation.concat(response.data.stduentEducation),
                    isExpSaveEnabled:false,
                    isEduSaveEnabled:false,
                    isObjSaveEnabled:false,
                    isContactSaveEnabled:false,
                    isSkillsSaveEnabled:false
                });
            });
        
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
            const studentEdu = this.state.stduentEducation;

            studentEdu.map((edu) => {
                if (edu.student_education_id === id) {
                    edu[name] = e.target.value;
                }

            })
            this.setState({
                stduentEducation: studentEdu,
                isEduSaveEnabled: true
            })
        } else if (type === "experience") {
            const studentExper = this.state.studentExperience;

            studentExper.map((exp) => {
                if (exp.student_exp_id === id) {
                    exp[name] = e.target.value;
                    console.log(e.target.value);
                }
            })
            this.setState({
                studentExperience: studentExper,
                isExpSaveEnabled: true
            })
        }else if (type === "studentObject"){
            const studObj = this.state.studentObject;
            console.log('in edit handler')
            studObj.map((obj)=>{
                if(obj.student_id ===id ){
                    obj[name] = e.target.value;
                    console.log(e.target.value);
                }
            })
            this.setState({
                studentObject: studObj,
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
        if(type === "experience"){
        console.log('Save these ',this.state.studentExperience)

        axios.put('http://localhost:8080/profile/editExperience/:'+this.state.studentExperience[0].fk_student_id, this.state.studentExperience)
              .then((response)=>{
                  console.log(response.status)
                  if(response.status === 200){
                    this.setState({
                        isExpSaveEnabled:false
                    }
                    )
                  }
              });
        }else if (type === "education"){
            //console.log('Save Education', this.state.stduentEducation)

             axios.put('http://localhost:8080/profile/editEducation/:'+this.state.stduentEducation[0].fk_student_id, this.state.stduentEducation)
              .then((response)=>{
                  console.log(response.status)
                  if(response.status === 200){
                    this.setState({
                        isEduSaveEnabled:false
                    }
                    )
                  }
              });
        }else if(type === "studentObject"){
           // console.log('Save Education', this.state.stduentEducation)

             axios.put('http://localhost:8080/profile/editstudentObject/:'+this.state.studentObject[0].student_id, this.state.studentObject)
              .then((response)=>{
                  console.log(response.status)
                  if(response.status === 200){
                    this.setState({
                        isObjSaveEnabled:false,
                        isContactSaveEnabled:false,
                        isSkillsSaveEnabled :false
                    }
                    )
                  }
              });
        }
    }

    //get the books data from backend  
    componentDidMount(){
        axios.get('http://localhost:8080/profile')
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

        let skills = this.state.studentObject.map(obj => {
            return (
                <div key = {obj.email}>
                    <div  className="form-group">
                        <textarea  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isSkillsSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"skills","studentObject")} defaultValue = {obj.skills}/>
                     </div>
                </div>
            )
        })
        
        let Objective = this.state.studentObject.map(obj=>{
            return(
                <div key ={obj.objective} className="form-group">
                        <input  style ={{width:'90%',borderRadius:'7px'}} type = "text" disabled={!this.state.isObjSaveEnabled}  onChange = {(e)=>this.changeHandler(e,obj.student_id,"objective","studentObject")} defaultValue = {obj.objective}/>
                </div>
            )
        })



        let educationDetails = this.state.stduentEducation.map(obj=>{
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
//export Profile Component
export default Profile;