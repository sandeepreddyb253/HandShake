import { SAVE_EXPERIENCE,FETCH_PROFILE, SAVE_STUD_OBJECT, SAVE_EDUCATION, DELETE_EDUCATION, DELETE_EXPERIENCE,LOGIN,REGISTER} from "../constants/action-types";
import axios from 'axios';
import cookie from 'react-cookies';

export function fetchProfile(payload) {
  console.log("dispatching the action")
  return function(dispatch){
    axios.get('http://localhost:8080/profile/'+payload)
                .then((response) => dispatch({
                  type:FETCH_PROFILE,
                  payload : response.data
                }));
                
  } 
}


export function saveExperience(payload){
  return function(dispatch){
    console.log('payload::', payload);
    axios.put('http://localhost:8080/profile/editExperience/:'+ payload[0].student_exp_id , payload)
              .then((response)=> dispatch({
                  type: SAVE_EXPERIENCE,
                  payload : response
              }));
              dispatch(fetchProfile(payload[0].fk_student_id))
  }    
}

export function saveEducation(payload){
  return function(dispatch){
    axios.put('http://localhost:8080/profile/editEducation/:'+payload[0].student_education_id, payload)
              .then((response)=>dispatch({
                type: SAVE_EDUCATION,
                payload: response
              }));
              dispatch(fetchProfile(payload[0].fk_student_id))
            }
  }



export function saveStudentObject(payload){

  return function(dispatch){
    axios.put('http://localhost:8080/profile/editstudentObject/:'+payload[0].student_id, payload)
              .then((response)=>dispatch({
                type: SAVE_STUD_OBJECT,
                payload : response
              }));
                  
              
              dispatch(fetchProfile(payload[0].student_id))
  }
}

export function deleteExperience(payload){

  return function(dispatch){
    axios.delete('http://localhost:8080/profile/deleteExperience/'+payload)
    .then((response) => dispatch({
      type : DELETE_EXPERIENCE, 
      payload : response

    }));
    dispatch(fetchProfile(cookie.load('cookie')))
  }
  
}

export function deleteEducation(payload){

  return function(dispatch){
    axios.delete('http://localhost:8080/profile/deleteEducation/'+payload)
    .then((response) => dispatch({
      type : DELETE_EDUCATION, 
      payload : response

    }));
    dispatch(fetchProfile(cookie.load('cookie')))
  }

}

export function auth(payload){

  return async function(dispatch){
   await axios.post('http://localhost:8080/auth',payload)
    .then((response) => dispatch({
      type : LOGIN, 
      payload : response

    }));
    //dispatch(fetchProfile(1))
  }

}


export  function register(payload){

  return async function(dispatch){
    await axios.post('http://localhost:8080/register',payload)
    .then((response) =>  dispatch({
      type : REGISTER, 
      payload : response

    }));
    //dispatch(fetchProfile(1))
  }

}