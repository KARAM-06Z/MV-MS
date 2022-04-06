import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from "./store/app.reducer";
import * as authActions from './Authentication/store/auth.actions';
import * as storeActions from "./main/store/store/store.actions";
import { appService } from './app.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'MVMT-MS';
  loggedIn:boolean = false;
  loggedInSubscription:Subscription;

  overflow:boolean;
  popUpSubscription:Subscription;

  constructor(private store:Store<fromApp.appState> , private appService:appService){}

  ngOnInit(): void {
    this.store.select('authentication').subscribe((resData) => {
      if(resData && resData.error){
        if(resData.error === "NAN-SUCCESS"){
            this.appService.onLogIn();
        }else if(resData.error === "NAN-TERMINATE"){
          this.appService.onLogOut();
        }
      }
    });
    
    this.store.dispatch(new authActions.autoLogIn());
    //this.store.dispatch(new authActions.resetState());

    this.loggedInSubscription = this.appService.loggedIn.subscribe( (condition) => {
      if(condition){
        this.onLoggedIn();
        this.store.dispatch(new storeActions.fetchStart());
      }else{
        this.onLoggedOut();
        this.store.dispatch( new storeActions.fetchClear());
      }
    });
  }

  onLoggedOut(){
    this.loggedIn = false;
  }

  onLoggedIn(){
    this.loggedIn = true;
  }
}
