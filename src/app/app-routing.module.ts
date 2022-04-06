import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { authGuard } from "./Authentication/Additional/authGuard";
import { CreateComponent } from "./main/create/create.component";
import { ProductComponent } from "./main/product/product.component";
import { StoreComponent } from "./main/store/store.component";

const appRoutes:Routes = [
    {path:"" , component:StoreComponent , pathMatch: 'full' , children:[
        {path:":page" , component:StoreComponent},
    ]}, 
    {path: "Create" , component: CreateComponent, canActivate:[authGuard]},
    {path: "Product" , component: ProductComponent, canActivate:[authGuard] , children:[
        {path:":product" , component:ProductComponent},
    ]},
];


@NgModule({
    imports : [RouterModule.forRoot(appRoutes)],
    exports : [RouterModule]
})
export class appRoutingModule{}