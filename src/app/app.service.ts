import { Injectable, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class appService{
    productColors=[
        {name:"Red" , image:"/assets/images/colors/red.jpg"},
        {name:"Green" , image:"/assets/images/colors/green.jpg"},
        {name:"Brown" , image:"/assets/images/colors/brown.jpg"},
        {name:"L Brown" , image:"/assets/images/colors/L-brown.png"},
        {name:"White" , image:"/assets/images/colors/white.jpg"},
        {name:"Black" , image:"/assets/images/colors/black.jpg"},
        {name:"Baige" , image:"/assets/images/colors/baige.jpg"},
        {name:"Blue" , image:"/assets/images/colors/blue.png"},
        {name:"Silver" , image:"/assets/images/colors/silver.png"},
        {name:"Bronze" , image:"/assets/images/colors/bronze.png"},
        {name:"Gold" , image:"/assets/images/colors/gold.png"},
        {name:"Rose" , image:"/assets/images/colors/rose.png"},
        {name:"L-Blue" , image:"/assets/images/colors/L-blue.png"},
    ];
    @Output() loggedIn = new BehaviorSubject<boolean>(false);

    onLogIn(){
        this.loggedIn.next(true);
    }

    onLogOut(){
        this.loggedIn.next(false);
    }

    stopOverflow(condition){
        if(condition){
            document.body.style.overflow="hidden";
        }else{
        document.body.style.overflow="auto";
        }
    }
}