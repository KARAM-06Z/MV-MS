import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { catchError, EMPTY, finalize, first, map , of , switchMap, take, tap } from "rxjs";
import { productModel } from "src/app/Aditional/models/product.model";
import * as storeActions from "./store.actions";
import * as fromApp from "../../../store/app.reducer";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { pageInfo } from "src/app/Aditional/models/pageInfo.model";


@Injectable()
export class storeEffects{
    constructor(private store:Store<fromApp.appState>,
                private actions:Actions,
                private http:HttpClient,
                private router:Router,
                private storge:AngularFireStorage
                ){}

    private imageUploader(product:productModel , type:string , id?:number){
        var files:File[] = product.imagesFile;
        var imagesURLs = product.imagesURL ? [...product.imagesURL] : [];
        var imagesCount = 0;

        for (let i = 0; i < files.length; i++) {
            setTimeout(() => {        
                var filePath = "product-"+files[i].name+"-"+new Date().getTime();
                var fileRef = this.storge.ref(filePath);
            
                this.storge.upload( filePath , files[i]).snapshotChanges().pipe(
                    finalize(() => {
                        fileRef.getDownloadURL().subscribe( url => {
                            imagesURLs.push(url);
                            imagesCount++;

                            if(imagesCount == files.length){
                                    const newProduct:productModel ={
                                        name: product.name,
                                        price: product.price,
                                        colors: product.colors,
                                        target: product.target,
                                        privecy: product.privecy,
                                        imagesURL: imagesURLs,
                                        imagesFile : [],
                                        productKey:product.productKey
                                    }
    
                                    if(type === "INSERT"){
                                        this.store.dispatch(new storeActions.createInsert(newProduct));
                                    }else if(type === "UPDATE"){
                                        this.store.dispatch(new storeActions.editEdit({product:newProduct , id:id}));
                                    }
                            }else{

                            }
                        });
                    })
                ).subscribe();
            }, 0);
        }
    }

    
    @Effect()
    storeCreateStart = this.actions.pipe(
        ofType(storeActions.CREATE_START),
        map( (createStartAction:storeActions.createStart) => {
            return new storeActions.createUpload(createStartAction.payload);
        })
    );

    @Effect({dispatch:false})
    storeCreateUpload = this.actions.pipe(
        ofType(storeActions.CREATE_UPLOAD),
        tap( (createUploadAction:storeActions.createStart) => {
            this.imageUploader(createUploadAction.payload , "INSERT");
        })
    );

    @Effect()
    storeCreateInsert = this.actions.pipe(
        ofType(storeActions.CREATE_INSERT),
        switchMap((createInsertAction:storeActions.createInsert) => {
            return this.http.post<{name:string}>("https://mvmt-manager-default-rtdb.firebaseio.com/products.json" , createInsertAction.payload).pipe(
                map((resData) => {
                    const newProduct:productModel = {
                        name: createInsertAction.payload.name,
                        price: createInsertAction.payload.price,
                        colors: createInsertAction.payload.colors,
                        target: createInsertAction.payload.target,
                        privecy: createInsertAction.payload.privecy,
                        imagesURL: createInsertAction.payload.imagesURL,
                        productKey: resData.name
                    };
                    return new storeActions.createSuccess(newProduct);
                }),
                catchError(resError => {
                    return of(new storeActions.createFail(resError.name));
                })
            );
        })
    );

    @Effect({dispatch:false})
    storeCreateSuccess = this.actions.pipe(
        ofType(storeActions.CREATE_SUCCESS),
        tap( () =>{
            this.router.navigate(['/'],{queryParams:{page:1}});
        }
        )
    );


    @Effect()
    storeFetchStart = this.actions.pipe(
        ofType(storeActions.FETCH_START),
        switchMap( (fetchStartAction:storeActions.fetchStart) => {
            return this.http.get<productModel>("https://mvmt-manager-default-rtdb.firebaseio.com/products.json").pipe(
                map( resData => {
                    var products:productModel[] = [];

                    for(let key in resData){
                        products.push({
                            name:resData[key].name,
                            price:resData[key].price,
                            target:resData[key].target,
                            privecy:resData[key].privecy,
                            colors:resData[key].colors,
                            imagesURL:resData[key].imagesURL,
                            productKey:key
                        });
                    }
                    
                    return new storeActions.fetchSuccess(products);
                }),
                catchError(resError => {
                    return of(new storeActions.fetchFail(resError.name));
                })
            );
        })
    );

    @Effect()
    storeGetProducStart = this.actions.pipe(
        ofType(storeActions.GET_PRODUCTS_START),
        map( (getProductStartAction:storeActions.getProductsStart) => {
            const page = getProductStartAction.payload; 
            const firstIndex = (page*8)-8;
            const lastIndex = page*8;

            const nextPage = page+1;
            const previousPage = page-1;

            const pageInfo:pageInfo = {
                page: page,
                nextPage: nextPage,
                previousPage: previousPage,
                firstIndex: firstIndex,
                lastIndex: lastIndex
            }

            return new storeActions.getProducts(pageInfo);
        })
    );

    @Effect()
    storeDeleteStart = this.actions.pipe(
        ofType(storeActions.DELETE_START),
        switchMap( (deleteStartAction:storeActions.deleteStart) => {
            const key = deleteStartAction.payload.key;
            return this.http.delete("https://mvmt-manager-default-rtdb.firebaseio.com/products/"+key+".json").pipe(
                map( () => {
                    return new storeActions.deleteSuccess(deleteStartAction.payload.id);
                }),
                catchError(resError => {
                    return of(new storeActions.deleteFail(resError.name));
                })
            );
        })
    );

    @Effect({dispatch:false})
    storeDeleteSuccess = this.actions.pipe(
        ofType(storeActions.DELETE_SUCCESS),
        tap( () =>{
            this.router.navigate(['/'],{queryParams:{page:1}});
        }
        )
    );

    

    @Effect()
    storeEditStart = this.actions.pipe(
        ofType(storeActions.EDIT_START),
        map( (editStartAction:storeActions.editStart) => {
            return new storeActions.editUpload(editStartAction.payload);
        })
    );

    @Effect({dispatch:false})
    storeEditUpload = this.actions.pipe(
        ofType(storeActions.EDIT_UPLOAD),
        tap( (editUploadStartAction:storeActions.editUpload) => {
            if(editUploadStartAction.payload.product.imagesFile.length > 0){
                this.imageUploader(editUploadStartAction.payload.product , "UPDATE" , editUploadStartAction.payload.id);
            }else{
                this.store.dispatch(new storeActions.editEdit({product:editUploadStartAction.payload.product , id:editUploadStartAction.payload.id}));
            }
        })
    );

    @Effect()
    storeEditEdit = this.actions.pipe(
        ofType(storeActions.EDIT_EDIT),
        switchMap( (editStartActon:storeActions.editEdit) => {
            const key = editStartActon.payload.product.productKey;
            return this.http.put("https://mvmt-manager-default-rtdb.firebaseio.com/products/"+key+".json", editStartActon.payload.product).pipe(
                map(() => {
                    return new storeActions.editSuccess({product:editStartActon.payload.product , id:editStartActon.payload.id});
                }),
                catchError(resError => {
                    return of(new storeActions.editFail(resError.name));
                })
            );
        })
    );


    @Effect()
    storeSortStart = this.actions.pipe(
        ofType(storeActions.SORT_START),
        map((sortStartAction:storeActions.sortStart) => {
            return new storeActions.sort(sortStartAction.payload);
        })
    );

    @Effect({dispatch:false})
    storeSort = this.actions.pipe(
        ofType(storeActions.SORT),
        tap( () => {
            this.router.navigate(['/'],{queryParams:{page:1}});
        })
    );

    @Effect()
    storeSearchStart = this.actions.pipe(
        ofType(storeActions.SEARCH_START),
        map((searchStartAction:storeActions.searchStart) => {
            return new storeActions.search(searchStartAction.payload);
        })
    );
}