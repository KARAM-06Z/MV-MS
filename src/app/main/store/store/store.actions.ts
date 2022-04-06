import { Action } from "@ngrx/store";
import { pageInfo } from "src/app/Aditional/models/pageInfo.model";
import { productModel } from "src/app/Aditional/models/product.model";

export const CREATE_START = "[STORE] CREATE_START";
export const CREATE_UPLOAD = "[STORE] CREATE_UPLOAD";
export const CREATE_INSERT = "[STORE] CREATE_INSERT";
export const CREATE_SUCCESS = "[STORE] CREATE_SUCCESS";
export const CREATE_FAIL = "[STORE] CREATE_FAIL";

export const FETCH_START = "[STORE] FETCH_START";
export const FETCH_SUCCESS= "[STORE] FETCH_SUCCESS";
export const FETCH_FAIL= "[STORE] FETCH_FAIL";
export const FETCH_CLEAR = "[STORE] FETCH_CLEAR";

export const GET_PRODUCTS_START = "[STORE] GET_PRODUCTS_START";
export const GET_PRODUCTS = "[STORE] GET_PRODUCTS";

export const DELETE_START = "[STORE] DELETE_START";
export const DELETE_SUCCESS = "[STORE] DELETE_SUCCESS";
export const DELETE_FAIL = "[STORE] DELETE_FAIL";

export const EDIT_START = "[STORE] EDIT_START";
export const EDIT_SUCCESS = "[STORE] EDIT_SUCCESS";
export const EDIT_FAIL = "[STORE] EDIT_FAIL";
export const EDIT_UPLOAD = "[STORE] EDIT_UPLOAD";
export const EDIT_EDIT = "[STORE] EDIT_EDIT";

export const SET_ITEM = "[STORE] SET_ITEM";
export const CLEAR_ITEM = "[STORE] CLEAR_ITEM";

export const SORT_START = "[STORE] SORT_START";
export const SORT = "[STORE] SORT_COMPLETE";

export const SEARCH_START = "[STORE] SEARCH_START";
export const SEARCH = "[STORE] SEARCH";
export const SEARCH_CLEAR= "[STORE] SEARCH_CLEAR";

export class createStart implements Action{
    readonly type = CREATE_START;

    constructor(public payload:productModel){}
}

export class createUpload implements Action{
    readonly type = CREATE_UPLOAD;

    constructor(public payload:productModel){}
}

export class createInsert implements Action{
    readonly type = CREATE_INSERT;

    constructor(public payload:productModel){}
}

export class createSuccess implements Action{
    readonly type = CREATE_SUCCESS;

    constructor(public payload:productModel){}
}

export class createFail implements Action{
    readonly type = CREATE_FAIL;

    constructor(public payload:string){}
}


export class fetchStart implements Action{
    readonly type = FETCH_START;
}

export class fetchSuccess implements Action{
    readonly type = FETCH_SUCCESS;

    constructor(public payload:productModel[]){}
}

export class fetchFail implements Action{
    readonly type = FETCH_FAIL;

    constructor(public payload:string){}
}

export class fetchClear implements Action{
    readonly type = FETCH_CLEAR;
}

export class getProductsStart implements Action{
    readonly type = GET_PRODUCTS_START;

    constructor(public payload:number){}
}

export class getProducts implements Action{
    readonly type = GET_PRODUCTS;

    constructor(public payload:pageInfo){}
}

export class deleteStart implements Action{
    readonly type = DELETE_START;

    constructor(public payload:{key:string,id:number}){}
}

export class deleteSuccess implements Action{
    readonly type = DELETE_SUCCESS;

    constructor(public payload:number){}
}

export class deleteFail implements Action{
    readonly type = DELETE_FAIL;

    constructor(public payload:string){}
}

export class editStart implements Action{
    readonly type = EDIT_START;

    constructor(public payload:{product:productModel , id:number}){}
}

export class editSuccess implements Action{
    readonly type = EDIT_SUCCESS;

    constructor(public payload:{product:productModel , id:number}){}
}

export class editFail implements Action{
    readonly type = EDIT_FAIL;

    constructor(public payload:string){}
}

export class editUpload implements Action{
    readonly type = EDIT_UPLOAD;

    constructor(public payload:{product:productModel , id:number}){}
}

export class editEdit implements Action{
    readonly type = EDIT_EDIT;

    constructor(public payload:{product:productModel , id:number}){}
}

export class setItem implements Action{
    readonly type = SET_ITEM;

    constructor(public payload:string){}
}

export class clearItem implements Action{
    readonly type = CLEAR_ITEM;
}

export class sortStart implements Action{
    readonly type = SORT_START;

    constructor(public payload:string){}
}

export class sort implements Action{
    readonly type = SORT;

    constructor(public payload:string){}
}

export class searchStart implements Action{
    readonly type = SEARCH_START;

    constructor(public payload:string){}
}

export class search implements Action{
    readonly type = SEARCH;

    constructor(public payload:string){}
}

export class searchClear implements Action{
    readonly type = SEARCH_CLEAR;
}


export type storeActions = 
  createStart | createUpload | createInsert | createSuccess | createFail 
| fetchStart | fetchSuccess | fetchFail | fetchClear 
| getProductsStart | getProducts
| deleteStart | deleteSuccess | deleteFail 
| editStart | editSuccess | editFail | editUpload | editEdit
| setItem | clearItem
| sortStart | sort
| searchStart | search | searchClear;