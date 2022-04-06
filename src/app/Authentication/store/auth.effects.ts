import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { catchError, map, of, switchMap, take, tap } from "rxjs";
import * as authActions from './auth.actions';

export interface AuthResponseData{
    kind : string;
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered?:boolean;
}

@Injectable()
export class authEffects{
    constructor(private actions:Actions , private http:HttpClient , private router:Router){}

    @Effect()
    authLogIn = this.actions.pipe(
        ofType(authActions.START_LOG_IN),
        switchMap( (logInStartAction:authActions.logInStart) =>{
            return this.http.post<AuthResponseData>("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAhRmkIP3wlit8NCVjOO3g8iZWDoZO5te4" , {
                email: logInStartAction.payload.email,
                password: logInStartAction.payload.password,
                returnSecureToken: true
            }).pipe(
                map( (resData) => {
                    return this.HandleLogIn(resData);
                }),
                catchError(resError => {
                    return of(new authActions.logInFail(this.HandleError(resError)));
                })
            );
        })
    );

    @Effect()
    authAutoLogIn = this.actions.pipe(
        ofType(authActions.AUTO_LOG_IN),
        take(1),
        map( () => {
            let userData = localStorage.getItem('userData');

            if(userData){
                userData = JSON.parse(userData);
                const expiresIn = new Date(userData['expiresIn']);

                return new authActions.logInSuccess({
                    email:userData['email'],
                    id:userData['localId'],
                    token:userData['idToken'],
                    expirationDate:expiresIn
                });
            }else{
                return new authActions.logInFail("");
            }

            return{type:"null"};
        })
    );

    // @Effect()
    // logOut = this.actions.pipe(
    //     ofType(authActions.LOG_OUT),
    //     tap( () => {
    //         localStorage.removeItem('userData');
    //         return null;
    //     })
    // );

    ///////////////////////////////////////
    ///////////////////////////////////////

    private HandleLogIn(resData){
        localStorage.setItem('userData' , JSON.stringify(resData));
        const expiresIn = new Date(resData.expiresIn);

        return new authActions.logInSuccess({
            email:resData.email,
            id:resData.localId,
            token:resData.idToken,
            expirationDate:expiresIn
        });
    }

    private HandleError(resError) {
        switch(resError.error.error.message){
            case "EMAIL_NOT_FOUND":
                return "No acount with this E-mail was found.";
            case "INVALID_PASSWORD":
                return "Incorrect password.";
            default:
                return "Something went wrong.";
        }
    }
}