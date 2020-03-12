import { SAVE_EXPERIENCE,FETCH_PROFILE, SAVE_STUD_OBJECT, SAVE_EDUCATION, DELETE_EDUCATION, DELETE_EXPERIENCE,LOGIN,REGISTER} from "../constants/action-types";
import axios from 'axios';
import cookie from 'react-cookies';
import {backend} from "../../webConfig"

export function fetchProfile(payload) {
  console.log("dispatching the action")
  return function(dispatch){
    axios.get(backend+'profile/'+payload)
                .then((response) => dispatch({
                  type:FETCH_PROFILE,
                  payload : response.data
                }));
                
  } 
}


export function saveExperience(payload){
  return async function(dispatch){
    console.log('payload::', payload);
   await axios.put(backend+'profile/editExperience/:'+ payload[0].student_exp_id , payload)
              .then((response)=> dispatch({
                  type: SAVE_EXPERIENCE,
                  payload : response
              }));
              dispatch(fetchProfile(payload[0].fk_student_id))
  }    
}

export function saveEducation(payload){
  return function(dispatch){
    axios.put(backend+'profile/editEducation/:'+payload[0].student_education_id, payload)
              .then((response)=>dispatch({
                type: SAVE_EDUCATION,
                payload: response
              }));
              dispatch(fetchProfile(payload[0].fk_student_id))
            }
  }



export function saveStudentObject(payload){

  return async function(dispatch){
    console.log('fileData::',payload[0].fileData)
    var resumePath
    await axios.post(backend+'uploadFile/?studentId='+payload[0].student_id+'&type=studentProfilePic',payload[0].fileData)
        .then(response => {
            console.log("Status Code : ",response);
            if(response.status === 200){
                 resumePath = response.data.filename
                
            }
            else{
                console.log('Error in saving application');
            }
        });
    console.log('path:',resumePath)
    await axios.put(backend+'profile/editstudentObject/:'+payload[0].student_id+'/?filePath='+resumePath, payload)
              .then((response)=>dispatch({
                type: SAVE_STUD_OBJECT,
                payload : response
              }));
                  
              
   dispatch(fetchProfile(payload[0].student_id))
  }
}

export function deleteExperience(payload){

  return function(dispatch){
    axios.delete(backend+'profile/deleteExperience/'+payload)
    .then((response) => dispatch({
      type : DELETE_EXPERIENCE, 
      payload : response

    }));
    dispatch(fetchProfile(cookie.load('cookie').split(':')[1]))
  }
  
}

export function deleteEducation(payload){

  return function(dispatch){
    axios.delete(backend+'profile/deleteEducation/'+payload)
    .then((response) => dispatch({
      type : DELETE_EDUCATION, 
      payload : response

    }));
    dispatch(fetchProfile(cookie.load('cookie').split(':')[1]))
  }

}

export function auth(payload){

  return async function(dispatch){
   await axios.post(backend+'auth',payload)
    .then((response) => dispatch({
      type : LOGIN, 
      payload : response

    }));
    //dispatch(fetchProfile(1))
  }

}


export  function register(payload){

  return async function(dispatch){
    await axios.post(backend+'register',payload)
    .then((response) =>  dispatch({
      type : REGISTER, 
      payload : response

    }));
    //dispatch(fetchProfile(1))
  }

}