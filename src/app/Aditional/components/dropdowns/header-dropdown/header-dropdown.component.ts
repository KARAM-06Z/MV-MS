import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from "../../../../store/app.reducer";
import * as authActions from '../../../../Authentication/store/auth.actions';
import * as storeActions from '../../../../main/store/store/store.actions';
import { Router } from '@angular/router';
import { headerDropdownService } from './header-dropdown.service';


@Component({
  selector: 'app-header-dropdown',
  templateUrl: './header-dropdown.component.html',
  styleUrls: ['./header-dropdown.component.css']
})
export class HeaderDropdownComponent implements OnInit {
  opened:boolean = false;

  constructor(private store:Store<fromApp.appState> , private router:Router , private headerDropdownService:headerDropdownService) { }

  ngOnInit(): void {
    this.headerDropdownService.dropdownControl.subscribe(condition => {
      this.opened = condition;
    });
  }

  onLogOut(){
    this.store.dispatch(new authActions.logOut());
    this.store.dispatch(new authActions.resetState());
    this.store.dispatch(new storeActions.fetchClear());
  }
}
