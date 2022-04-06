import { sort } from "src/app/Aditional/functions";
import { pageInfo } from "src/app/Aditional/models/pageInfo.model";
import { productModel } from "src/app/Aditional/models/product.model";
import * as storeActions from "./store.actions";

export interface state{
    selectedProduct:{
        product:productModel;
        id:number;
        notfound?:boolean;
    };
    products:productModel[];
    productsInPreview:productModel[];
    searchedProducts:productModel[];
    error:string;
    loading:boolean;
    loadingSearch:boolean;
    editMode:boolean;
    pageInfo:pageInfo;
    sort:string;
};

const intialState:state= {
    error: null,
    loading: false,
    loadingSearch:false,
    products: null,
    selectedProduct:null,
    productsInPreview:null,
    searchedProducts:null,
    pageInfo: null,
    editMode: false,
    sort: null,
};

export function storeReducer(state:state = intialState, action:storeActions.storeActions){
    switch(action.type){
        case storeActions.CREATE_START:
            return {
                ...state,
                loading:true,
                error:null
            };
        case storeActions.CREATE_UPLOAD:
        case storeActions.CREATE_INSERT:
            return {...state};
        case storeActions.CREATE_SUCCESS:
            var newProducts_create = [...state.products , action.payload];

            if(state.sort){
                newProducts_create = sort(state.sort , newProducts_create);
            }
            return {
                ...state,
                loading:false,
                error:null,
                products:newProducts_create
            };
        case storeActions.CREATE_FAIL:
            return {
                ...state,
                loading:false,
                error: action.payload
            };
        

        case storeActions.FETCH_START:
            return {
                ...state,
                error:null,
                products:[],
                loading:true
            };
        case storeActions.FETCH_SUCCESS:
            return {
                ...state,
                error:null,
                products:[...action.payload],
                loading:false
            };
        case storeActions.FETCH_FAIL:
            return {
                ...state,
                error:action.payload,
                products:[],
                loading:false
            };
        case storeActions.FETCH_CLEAR:
            return {
                ...state,error:null,
                editMode:false,
                products:[],
                productsInPreview:null,
                selectedProduct:null,
                searchedProducts:null,
                pageInfo:null,
                loading:false,
                sort:null
            };


        case storeActions.GET_PRODUCTS_START:
            return{...state};
        case storeActions.GET_PRODUCTS:
            var products:productModel[] = [...state.products];
            var previewProducts:productModel[] = [];
            var firstIndex = action.payload.firstIndex;
            var lastIndex = action.payload.lastIndex;

            if(lastIndex > products.length){
                lastIndex = products.length;
            }
                
            for(let i = firstIndex ; i < lastIndex ; ++i){
                previewProducts.push(products[i]);
            }

            const maxPage = Math.ceil(products.length / 8);

            var pageInfo:pageInfo = {
                page: action.payload.page,
                nextPage: action.payload.nextPage,
                previousPage: action.payload.previousPage,
                firstIndex: action.payload.firstIndex,
                lastIndex: action.payload.lastIndex,
                maxPage: maxPage,
            };

            return{
                ...state,
                pageInfo:pageInfo,
                productsInPreview:previewProducts
            };


        case storeActions.DELETE_START:
            return{
                ...state,
                loading:true,
                error:null
            };
        case storeActions.DELETE_SUCCESS:
            var newProducts_delete = [...state.products];
            newProducts_delete = newProducts_delete.filter((product,id) => {return id !== action.payload});
            return{
                ...state,
                loading:false,
                error:null,
                products:newProducts_delete
            };
        case storeActions.DELETE_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload
            };


        case storeActions.EDIT_START:
            return{
                ...state,
                loading:true,
                error:null,
                editMode:true
            };
        case storeActions.EDIT_UPLOAD:
        case storeActions.EDIT_EDIT:
            return{...state};
        case storeActions.EDIT_SUCCESS:
            var newProducts_edit = [...state.products];
            newProducts_edit[action.payload.id] = action.payload.product;

            if(state.sort){
                newProducts_edit = sort(state.sort , newProducts_edit);
            }

            var new_selected = {
                product:action.payload.product,
                id:action.payload.id
            }

            return{
                ...state,
                error:null,
                loading:false,
                products: newProducts_edit,
                selectedProduct:new_selected,
                editMode:false
            };
        case storeActions.EDIT_FAIL:
            return{
                ...state,
                loading:false,
                error:action.payload
            };


        case storeActions.SET_ITEM:
            const key = action.payload;
            var products = [...state.products];
            var selected = {product:null,id:null,notfound:true};

            products.filter((product,id) => {
                if(product.productKey == key){ 
                    selected = {product:product , id:id , notfound:false}
                }
            });

            return{
                ...state,
                selectedProduct:selected
            };
        case storeActions.CLEAR_ITEM:
            return{
                ...state,
                selectedProduct: null
            };


        case storeActions.SORT_START:
            return{
                ...state,
                loading:true
            };
        case storeActions.SORT:
            var products = [...state.products];

            products = sort(action.payload , products);

            var newPreviewProducts = [];
            for(let i = 0 ; i < 8 ; ++i){
                newPreviewProducts.push(products[i]);
            }

            return{
                ...state,
                loading:false,
                products:products,
                productsInPreview:newPreviewProducts,
                sort:action.payload
            };


        case storeActions.SEARCH_START:
            return{
                ...state,
                loadingSearch:true,
                searchedProducts:null
            };
        case storeActions.SEARCH:
            var products = [...state.products];
            var searchedProducts:productModel[] = null;
            
            if(action.payload){
                searchedProducts = products.filter( (product) => {
                    var regex = new RegExp(action.payload, 'ig');
                    return product.name.match(regex)
                }).slice(0,12);
            }

            if(searchedProducts && searchedProducts.length == 0){
                searchedProducts= null;
            }
            
            return{
                ...state,
                loadingSearch:false,
                searchedProducts:searchedProducts
            };

        case storeActions.SEARCH_CLEAR:
            return{
                ...state,
                loadingSearch:false,
                searchedProducts:null
            }; 


        default:
            return state;
    }
}