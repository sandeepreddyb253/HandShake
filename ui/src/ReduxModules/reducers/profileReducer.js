import { SAVE_EXPERIENCE,FETCH_PROFILE, SAVE_EDUCATION, SAVE_STUD_OBJECT,DELETE_EDUCATION,DELETE_EXPERIENCE} from "../constants/action-types";

const initiaState = {
              studentObject : [],
              studentExperience:[],
              stduentEducation:[],
              saveObjectResponse:[]
  }
export default function profileReducer(state = initiaState, action){
    switch(action.type){
         case FETCH_PROFILE:
            return {
                ...state,
                studentObject: [].concat(action.payload.studentObject),
                studentExperience: [].concat(action.payload.studentExperience),
               stduentEducation : [].concat(action.payload.stduentEducation)
            };
        case SAVE_EDUCATION:
            return {
                ...state

            };
        case SAVE_EXPERIENCE:
            return {
                ...state
            };
        case SAVE_STUD_OBJECT:
            return{
                ...state,
                payload: action.payload
            };
        case DELETE_EDUCATION:
                return{
                    ...state
                };
        case DELETE_EXPERIENCE:
                    return{
                        ...state      
                    };

        default:
            return state;
    }
}