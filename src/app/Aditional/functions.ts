import { appService } from "../app.service";
import { productModel } from "./models/product.model";

export function sort(type:string , products:productModel[]){
    switch(type){
        case "SORT_N":
            products = products.sort((a, b) => {
                if(a.name[0] < b.name[0]) { return -1; }
                if(a.name[0] > b.name[0]) { return 1; }
                return 0;
            });
            return products;

        case "SORT_LH":
            products = products.sort((a, b) => {
                return a.price - b.price;
            });
            return products;

        case "SORT_HL":
            products = products.sort((a, b) => {
                return b.price - a.price;
            });
            return products;

        default:
            return products;
    }
}

export function capitalize(text:string){
    return text.replace(/(?<=\s|^)./g , (char) => {
        return char.toUpperCase();
    });
}

export function swapColors(toColorSwap:{firstIndex:number,secondIndex:number} , selectedColors:number[]){
    const holder = selectedColors[toColorSwap.firstIndex];

    selectedColors[toColorSwap.firstIndex] = selectedColors[toColorSwap.secondIndex];
    selectedColors[toColorSwap.secondIndex] = holder;

    return selectedColors;
}