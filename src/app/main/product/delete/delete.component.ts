import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from "../../../store/app.reducer";
import * as storeActions from "../../store/store/store.actions";

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  @Output() closePopUp = new EventEmitter();
  @Input() productKey:string;
  @Input() productID:number;

  constructor(private store:Store<fromApp.appState> ) { }

  ngOnInit(): void {
  }

  onCancel(event){
    if (event.target !== event.currentTarget) return;
    this.closePopUp.emit();
  }

  onConfirmDelete(){
    this.store.dispatch(new storeActions.deleteStart({key:this.productKey,id:this.productID}));
    this.closePopUp.emit();
  }
}
