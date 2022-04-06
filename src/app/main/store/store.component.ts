import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { sortDropdownService } from 'src/app/Aditional/components/dropdowns/sort-dropdown/sort-dropdown.service';
import { productModel } from 'src/app/Aditional/models/product.model';
import { appService } from 'src/app/app.service';
import { searchService } from './search/searchService';
import * as fromApp from "../../store/app.reducer";
import * as storeActions from "../store/store/store.actions";

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent implements OnInit , OnDestroy{
  @ViewChild("sortDropdownController") sortDropdownController:ElementRef;
  pageRenderer: () => void;
  productsSubscription:Subscription;
  routeSubscription:Subscription;
  products:productModel[] = [];
  loading:boolean = false;
  error:boolean = false;
  errorText:string;
  productColors:{name:string,image:string}[] = [];
  swapInterval= null;
  page:number = 1;
  maxPage :number;
  nextPage:number;
  previousPage:number;
  firstIndex:number;
  lastIndex:number;
  pageState:string = "READY";

  
  constructor(private store:Store<fromApp.appState>,
              private appService:appService, 
              private route:ActivatedRoute,
              private router:Router,
              private sortDropdownService:sortDropdownService,
              private searchService:searchService,
              private renderer:Renderer2) {}

  ngOnInit(): void {
    this.productsSubscription = this.store.select("store").subscribe( resData => {
      if(resData){
        this.loading = resData.loading;
        if(resData.pageInfo){
          this.nextPage =  resData.pageInfo.nextPage;
          this.previousPage = resData.pageInfo.previousPage;
          this.maxPage = resData.pageInfo.maxPage;
          this.page = resData.pageInfo.page;

          if(this.page > this.maxPage || this.page < 0){
            this.router.navigate(['/'],{queryParams:{page:1}});
          }
        }
      
        if(resData.products.length > 0 && this.pageState == "READY"){
          this.pageState = "DONE";
          this.store.dispatch(new storeActions.getProductsStart(this.page));
        }

        if(resData.productsInPreview){
          this.products = resData.productsInPreview; 
        }
      }
    });

    this.routeSubscription = this.route.queryParams.subscribe((params:Params) => { 
      
      if(params['page']){
        this.page = +params['page'];

        if(this.pageState == "DONE"){
        this.store.dispatch(new storeActions.getProductsStart(this.page));
        }
      }
    });

    this.productColors = this.appService.productColors;

    this.pageRenderer = this.renderer.listen("window" , "click" , (e:Event) => {
      if(this.sortDropdownService.opened && !this.sortDropdownController.nativeElement.contains(e.target)){
        this.sortDropdownService.onDropdownControl(false);
      }
    })

  }

  ngOnDestroy(): void {
    this.products = [];
    this.productsSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
    clearInterval(this.swapInterval)
    this.pageRenderer();
  }

  onImageSwap(event,i:number){
    var imageIndex:number = 0;
    const productImagesCount:number = this.products[i].imagesURL.length; 

    this.swapInterval = setInterval( () => {
      imageIndex++;
      if(imageIndex < productImagesCount){
        event.target.src = this.products[i].imagesURL[imageIndex];
      }else{
        event.target.src = this.products[i].imagesURL[0];
        imageIndex = 0;
      }
    } , 1500);
  }

  onImageRestore(event,i:number){
    clearInterval(this.swapInterval);
    event.target.src = this.products[i].imagesURL[0];
  }

  onDropdown(){
    this.sortDropdownService.onDropdownControl();
  }

  onSearch(){
    this.searchService.onComponentControl();
  }
}
