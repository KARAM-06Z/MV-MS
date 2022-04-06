import { Component , OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { sortDropdownService } from './sort-dropdown.service';

import * as fromApp from "../../../../store/app.reducer";
import * as storeActions from '../../../../main/store/store/store.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sort-dropdown',
  templateUrl: './sort-dropdown.component.html',
  styleUrls: ['./sort-dropdown.component.css']
})
export class SortDropdownComponent implements OnInit , OnDestroy{
  opened:boolean = false;
  sortType:string;
  storeSubscription:Subscription;

  constructor(private store:Store<fromApp.appState> , private sortDropdownService:sortDropdownService) { }

  ngOnInit(): void {
    this.sortDropdownService.dropdownControl.subscribe(condition => {
      this.opened = condition;
    });

    this.storeSubscription = this.store.select("store").subscribe( resData => {
      this.sortType = resData.sort;
    });
  }

  ngOnDestroy(): void {
      this.storeSubscription.unsubscribe();
  }

  onSort(sortType:string){
    this.sortType = sortType;
    this.store.dispatch(new storeActions.sortStart(sortType));
  }
}
