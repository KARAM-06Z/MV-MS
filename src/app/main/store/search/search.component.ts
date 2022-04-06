import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { searchService } from './searchService';
import * as fromApp from "../../../store/app.reducer";
import * as storeActions from "../../store/store/store.actions";
import { productModel } from 'src/app/Aditional/models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit , OnDestroy{
  opened:boolean = false;
  @ViewChild('searchInput') searchInput:ElementRef;
  searchedProducts:productModel[];
  searchServiceSubscription:Subscription;
  productsSubscription:Subscription;

  constructor(private searchService:searchService , private store:Store<fromApp.appState>) { }

  ngOnInit(): void {
    this.searchServiceSubscription = this.searchService.componentControl.subscribe(() => {
      this.opened = !this.opened;

      if(this.opened){
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        }, 0);
      }else{
        this.store.dispatch(new storeActions.searchClear());
      }
    });

    this.productsSubscription = this.store.select("store").subscribe(resData => {
      this.searchedProducts = resData.searchedProducts;
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new storeActions.searchClear());
    this.searchServiceSubscription.unsubscribe();
    this.productsSubscription.unsubscribe();
  }

  onSearch(){
    this.store.dispatch(new storeActions.searchStart(this.searchInput.nativeElement.value));
  }
}
