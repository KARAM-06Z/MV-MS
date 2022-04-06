export interface productModel{
    name:string;
    price:number;
    colors:number[];
    target:string;
    privecy:string;
    imagesURL?:string[];
    imagesFile?:File[];
    productKey?:string;
}