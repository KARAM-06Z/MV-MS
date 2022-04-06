import { Component , ElementRef, OnInit, OnDestroy , Renderer2, ViewChild } from '@angular/core';
import { headerDropdownService } from '../dropdowns/header-dropdown/header-dropdown.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit , OnDestroy{
  @ViewChild("headerDropdownController") headerDropdownController:ElementRef;
  pageRenderer: () => void;

  constructor(private headerDropdownService:headerDropdownService , private renderer:Renderer2) { }

  ngOnInit(): void {
    this.pageRenderer = this.renderer.listen("window" , "click" , (e:Event) => {
      if(this.headerDropdownService.opened && !this.headerDropdownController.nativeElement.contains(e.target)){
        this.headerDropdownService.onDropdownControl(false);
      }
    })
  }

  ngOnDestroy(): void {
      this.pageRenderer();
  }

  onDropdown(){
    this.headerDropdownService.onDropdownControl();
  }
}
