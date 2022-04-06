import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class searchService{
    componentControl = new Subject<void>();

    onComponentControl(){
        this.componentControl.next();
    }
}