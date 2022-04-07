import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { capitalize, swapColors } from 'src/app/Aditional/functions';
import { productModel } from 'src/app/Aditional/models/product.model';
import { appService } from 'src/app/app.service';
import * as fromApp from "../../store/app.reducer";
import * as storeActions from "../store/store/store.actions";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit , OnDestroy{
  product:productModel;
  @ViewChild('fileUploader') fileUploader:ElementRef;
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
  previewedImageIndex:number;
  loading = false;

  createSubscription:Subscription;

  constructor(private appService:appService , private store:Store<fromApp.appState>) { }

  ngOnInit(): void {
    this.productColors = this.appService.productColors;

    this.createSubscription = this.store.select('store').subscribe( (resData) => {
      if(resData){
        this.loading = resData.loading;
      }
    });
  }

  ngOnDestroy(): void {
      this.createSubscription.unsubscribe();
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
    this.selectedImages.splice(i,1);
    this.selectedImagesPreview.splice(i,1);

    if(this.selectedImagesPreview.length === 0){
      this.previewedImage = "assets/images/watch_BCK_grey.jpg";
    }else{
      if(i == this.previewedImageIndex){
        if(i <= this.selectedImagesPreview.length-1){
          this.previewedImage = this.selectedImagesPreview[i];
        }else if(i == this.selectedImagesPreview.length){
          this.previewedImage = this.selectedImagesPreview[i-1];
        }
      }
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
      }

    this.store.dispatch(new storeActions.createStart(product));
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
