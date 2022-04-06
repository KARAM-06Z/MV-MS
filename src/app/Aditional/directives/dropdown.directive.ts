import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Directive({selector:'[dropdown]'})
export class dropdownDirective{
    constructor(private elementRef:ElementRef,private renderer: Renderer2){}

    @HostListener('click') onClick() {
            const element = this.elementRef.nativeElement;
            let condition = element.attributes.visible.value;
            
            if(condition === "false"){
                element.attributes.visible.value = "true";
                this.renderer.addClass(element, 'dropdown_visible');
            }else if(condition === "true"){
                element.attributes.visible.value = "false";
                this.renderer.removeClass(element, 'dropdown_visible');
            }
    }

}