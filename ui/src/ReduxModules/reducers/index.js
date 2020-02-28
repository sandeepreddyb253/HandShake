import {combineReducers} from 'redux';
import profileReducer from './profileReducer';
import loginReducer from './loginReducer';
import registerReducer from './registerReducer'

export default combineReducers( {
    profile   : profileReducer,
    login      : loginReducer,
    register :registerReducer
  })
   