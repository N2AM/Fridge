import { Directive, ElementRef, OnInit, AfterViewChecked, AfterViewInit, AfterContentChecked, Input } from '@angular/core';

@Directive({
  selector: '[Checkbox]'
})
export class CheckboxDirective implements OnInit, AfterViewChecked, AfterViewInit, AfterContentChecked {
  @Input('id') id;
  constructor(private el: ElementRef) {
   }

   ngOnInit() {
    if(this.el.nativeElement) {
      const element = (this.el.nativeElement as HTMLElement);
    if(element.firstChild){
      let checkbox = element.firstChild as HTMLInputElement;
      checkbox.hidden = true;
      checkbox.classList.add('--checkbox-input');
      let checkboxContainer = document.createElement('label');
      checkboxContainer.innerHTML = `
      <label for="${this.id}" class="--checkbox-container cursor">
        <i class="--checkbox-icon" style="transform:scale(.7);"></i>
      </label>
    `;
    element.appendChild(checkboxContainer)
    }

   
    }
   }

   ngAfterViewChecked() {
   
   }

   ngAfterViewInit() {
 
   }
   ngAfterContentChecked() {
  
   }
}
