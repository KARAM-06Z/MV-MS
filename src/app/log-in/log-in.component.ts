import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { userForm } from 'src/app/Aditional/models/user-form.model';
import * as fromApp from "../store/app.reducer";
import * as authActions from '../Authentication/store/auth.actions';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  authSubscription:Subscription;
  @Output() closePopUp:EventEmitter<void> = new EventEmitter();
  @ViewChild("logInForm") logInForm!:NgForm;
  formError:boolean = false;
  formErrorText:string = "Error";
  loading:boolean = false;
  user:userForm = {
    email: "",
    password : "",
  }


  constructor(private store:Store<fromApp.appState>) { }

  ngOnInit(): void {
    this.authSubscription = this.store.select('authentication').subscribe( resData => {
      if(resData){
        this.loading = resData.loading;
      }

      if(resData && resData.error){
        this.formErrorText = resData.error;
        this.formError = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.formErrorText = "";
    this.formError = false;
    //this.store.dispatch(new authActions.resetState());
    this.authSubscription.unsubscribe();
  }

  onClose(element?){
    if(element.target.attributes.function && element.target.attributes.function.value === "close"){
      this.closePopUp.emit();
    }
  }

  OnSubmit(form:NgForm){
    if(form.form.status === "VALID"){
      this.formErrorText = "";
      this.formError = false;

      this.user.email = form.form.value.email;
      this.user.password = form.form.value.password;

      this.store.dispatch(new authActions.logInStart({email:this.user.email , password:this.user.password}));
    }else{
      for(var input of Object.values(form.form.controls)){
        if(input.status === "INVALID"){
          if(input.errors['required']){
            this.formErrorText = "Required field, All inputs must be filled.";
            this.formError = true;
            break;
          }else if(input.errors['email']){
            this.formErrorText = "Incorrect E-mail pattern.";
            this.formError = true;
            break;
           }
          // else if(input.errors['minlength']){
          //   this.formErrorText = "Password length is below the minimum of 6 characters.";
          //   this.formError = true;
          //   break;
          // }
        }
      }
    }
  }
}
