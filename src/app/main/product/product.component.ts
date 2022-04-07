import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { productModel } from 'src/app/Aditional/models/product.model';
import { appService } from 'src/app/app.service';
import * as fromApp from "../../store/app.reducer";
import * as storeActions from "../store/store/store.actions";
import { capitalize, swapColors } from 'src/app/Aditional/functions';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit , OnDestroy{
  @ViewChild('fileUploader') fileUploader:ElementRef;
  productID:number;
  productKey:string;
  product:productModel = {
    name: '',
    price: 0,
    colors: [],
    target: '',
    privecy: ''
  };
  productState:string = "READY";
  storeSubscription:Subscription;
  productColors:{name:string,image:string}[] = [];
  selectedColors:number[] = [];
  toColorSwap = {
    firstIndex: null,
    secondIndex: null
  };
  selectedImagesPreview:any[] = [];
  selectedImages:File[] = [];
  formError:boolean = false;
  formErrorText:string = "Error";
  previewedImage:any = "assets/images/watch_BCK_grey.jpg";
  previewedImageIndex:number = 0;
  loading:boolean = false;
  editing:boolean = false;
  deletePopUp:boolean = false;
  imagesURL:string[] = [];

  constructor(private store:Store<fromApp.appState> , private appService:appService , private route:ActivatedRoute , private router:Router) { }

  ngOnInit(): void {    
    if(this.route.children[0]){
      this.productKey = this.route.children[0].snapshot.params["product"];
    }else{
      this.router.navigate(["/"]);
    }

    this.productColors = this.appService.productColors;

    this.storeSubscription = this.store.select('store').subscribe( (resData) => {
      if(resData.products.length > 0 && this.productState == "READY"){
        this.store.dispatch(new storeActions.setItem(this.productKey));
        this.productState = "DONE";
      }
    
      if(resData){
        this.loading = resData.loading;
        this.editing = resData.editMode;

        if(resData.error){
          this.formErrorText = resData.error;
          this.formError = true;
        }
      }

      if(resData.selectedProduct){
        if(resData.selectedProduct.notfound){
          this.router.navigate(["/"]);
        }else{
          this.product = {...resData.selectedProduct.product};
          this.selectedColors = [...this.product.colors];
          this.selectedImagesPreview = [...this.product.imagesURL];
          this.imagesURL = [...this.product.imagesURL]
          this.previewedImage = this.selectedImagesPreview[0];
          this.productID = resData.selectedProduct.id;
      }
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new storeActions.clearItem());
    this.storeSubscription.unsubscribe();
  }
  

  openFileUploader(){
    let element: HTMLElement = this.fileUploader.nativeElement as HTMLElement;
    element.click();
  }

  onAddImage(event){
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    this.pushImage(event.target.files[0]);
    
    reader.onload = (event) => {
      this.pushImagePreview(event.target.result);
    };
  }

  pushImage(file){
    this.selectedImages.push(file);
  }

  pushImagePreview(result){
    this.selectedImagesPreview.push(result);

    if(this.selectedImagesPreview.length == 1){
      this.previewedImage = result;
      this.previewedImageIndex = 0;
    }
  }

  onRemoveImage(i){
    this.selectedImages.splice(i+this.imagesURL.length-2,1);
    this.selectedImagesPreview.splice(i,1);

    if(this.selectedImagesPreview.length === 0){
      this.previewedImage = "/assets/images/watch_BCK_grey.jpg";
    }else{
      if(i == this.previewedImageIndex){
        if(i <= this.selectedImagesPreview.length-1){
          this.previewedImage = this.selectedImagesPreview[i];
        }else if(i == this.selectedImagesPreview.length){
          this.previewedImage = this.selectedImagesPreview[i-1];
        }
      }
    }

    if(i < this.imagesURL.length){
      this.imagesURL.splice(i,1);
    }
  }

  onSelectImagePreview(i){
    this.previewedImage = this.selectedImagesPreview[i];
    this.previewedImageIndex = i;
  }

  onAddColor(i){
    if(!this.selectedColors.includes(i)){
      this.selectedColors.push(i);
    }
  }

  onRemoveColor(i){
    this.selectedColors.splice(this.selectedColors.indexOf(i) , 1);
  }

  onColorDrag(event){
    event.preventDefault();
  }

  onColorDrop(event){
    this.toColorSwap.secondIndex = +event.target.attributes.colorIndex.value;

    if(this.toColorSwap.firstIndex != this.toColorSwap.secondIndex){
      this.selectedColors = swapColors(this.toColorSwap,this.selectedColors);
    }
  }

  onEdit(){
    if(this.editing){
      this.formError = false;
      this.formErrorText = "";
    }
    this.editing = !this.editing;
  }

  onDeleteItem(){
    this.deletePopUp = !this.deletePopUp;
  }

  OnSubmit(form:NgForm){
    if(form.form.status === "VALID"){
      this.formError = false;
      this.formErrorText = "";

    if(this.selectedColors.length < 1){
      this.formErrorText = "At least one color must be selected.";
      this.formError = true;
    }else if(this.selectedImagesPreview.length < 1){
      this.formErrorText = "At least one image must be uploaded.";
      this.formError = true;
    }else{
      const product:productModel= {
        name: capitalize(form.form.value.name),
        price: form.form.value.price,
        colors: [...this.selectedColors],
        target: form.form.value.target,
        privecy: form.form.value.privecy,
        imagesFile : [...this.selectedImages],
        imagesURL : [...this.imagesURL],
        productKey: this.product.productKey,
      }

      this.store.dispatch(new storeActions.editStart({product:product , id:this.productID}));
    }
    }else if(form.form.status === "INVALID"){
      for(var input of Object.values(form.form.controls)){
        if(input.status === "INVALID"){
          if(input.errors['required']){
            this.formErrorText = "Required field, All inputs must be filled.";
            this.formError = true;
            break;
          }else if(input.errors['pattern']){
            this.formErrorText = "Wrong input pattern.";
            this.formError = true;
          }
        }
      }
    }
  }
}
