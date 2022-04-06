import { Action } from "@ngrx/store";

export const START_LOG_IN = "[Authentication] START_LOG_IN";
export const LOG_IN_SUCCESS = "[Authentication] LOG_IN_SUCCESS";
export const LOG_IN_FAIL = "[Authentication] LOG_IN_FAIL";
export const LOG_OUT = "[Authentication] LOG_OUT";
export const AUTO_LOG_IN = "[Authentication] AUTO_LOG_IN";
export const RESET_STATE = "[Authentication] RESET_STATE";

export class logInStart implements Action{    
    readonly type = START_LOG_IN;

    constructor(public payload:{email:string , password:string}){}
}

export class logInSuccess implements Action{
    readonly type= LOG_IN_SUCCESS;

    constructor(public payload:{email:string , id:string , token:string , expirationDate:Date}){}
}

export class logInFail implements Action{
    readonly type = LOG_IN_FAIL;

    constructor(public payload:string){}
}

export class logOut implements Action{
    readonly type = LOG_OUT;
}

export class autoLogIn implements Action{
    readonly type = AUTO_LOG_IN;
}

export class resetState implements Action{
    readonly type = RESET_STATE;
}

export type authActions = logInStart | logInSuccess | logInFail | logOut |autoLogIn | resetState;