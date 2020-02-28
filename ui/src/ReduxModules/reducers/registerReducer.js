import { REGISTER} from "../constants/action-types";

const initiaState = {
   registerData :[]
}
export default function registerReducer(state = initiaState, action){
switch(action.type){
    
    case REGISTER:
        console.log('payload::',action.payload)
        return {
        ...state,
        registerData:[].concat(action.payload) 
        };
    default:
        return state;
}}