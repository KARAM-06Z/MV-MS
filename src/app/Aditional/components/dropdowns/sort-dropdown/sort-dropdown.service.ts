import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class sortDropdownService{
    opened:boolean = false;
    dropdownControl = new Subject<boolean>();

    //A condition containing false will only be sent if clicked from anywhere on the window to close the dropdown
    //When the SORT button is clicked then it will reverse the condition of the dropdown
    onDropdownControl(condition?:boolean){
        if(!condition){
            this.opened = !this.opened;
            this.dropdownControl.next(this.opened);
            return;
        }

        this.opened = condition;
        this.dropdownControl.next(condition);
    } 
}