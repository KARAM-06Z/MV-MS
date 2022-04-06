import { user } from 'src/app/Aditional/models/user.model';
import * as authActions from './auth.actions';

export interface state{
    user:user;
    error:string;
    loading:boolean;
};

const intialState:state= {
    user:null,
    error:null,
    loading:false
};

export function authReducer(state:state , action:authActions.authActions){
    switch(action.type){
        case authActions.RESET_STATE:
            return {...state , user:null , error:null , loading:false};

        case authActions.START_LOG_IN:
        case authActions.AUTO_LOG_IN:
            return {...state , user:null , error:null , loading:true};

        case authActions.LOG_IN_SUCCESS:
            const USER = new user(action.payload.email,action.payload.id,action.payload.token,action.payload.expirationDate);
            return {...state , user:USER, error:"NAN-SUCCESS" , loading:false};

        case authActions.LOG_IN_FAIL:
            return {...state, user:null, error:action.payload , loading:false};

        case authActions.LOG_OUT:
            localStorage.removeItem('userData');
            return {...state , user:null, error:"NAN-TERMINATE" , loading:false};

        default:
            return state;
    }
}