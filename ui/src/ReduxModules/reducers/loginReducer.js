import { LOGIN} from "../constants/action-types";

const initiaState = {
   loginData :[]
}
export default function loginReducer(state = initiaState, action){
 switch(action.type){
    
    case LOGIN:
    console.log('payload::',action.payload)
    return {
        ...state,
        loginData: [].concat(action.payload)
        };
    default:
            return state;
}}