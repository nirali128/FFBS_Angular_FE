import { Directive, ElementRef, Input, Renderer2, SimpleChanges, OnChanges, HostListener, Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationErrors } from '../constants/validation.const';

@Directive({
  selector: '[appFormErrors]'
})
export class FormErrorsDirective implements OnChanges {
  @Input() controlValue!: FormControl;
  @Input() label!: string;

  constructor(private el: ElementRef, private renderer: Renderer2, private injector: Injector) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.controlValue) {
      this.controlValue.statusChanges.subscribe(() => {
        this.updateErrorMessages();
      });
    }
  }

  @HostListener('blur')
  onBlur(): void {
    this.updateErrorMessages();
  }

  @HostListener('document:submit', ['$event'])
  onFormSubmit(): void {
    this.updateErrorMessages();
  }

  private updateErrorMessages(): void {
    const errorMessages = this.getErrorMessages();
    this.toggleErrorVisibility(errorMessages);
  }

  private getErrorMessages(): string[] {
    const errors = this.controlValue?.errors;
    if (!errors) return [];

    return Object.keys(errors).map((errorKey) => {
      const errorMessage = ValidationErrors[errorKey];
      if (typeof errorMessage === 'function') {
        const errorValue = errors[errorKey];
  
        if (errorKey === 'required' || errorKey === 'pattern') {
          return errorMessage(this.label);
        }
        return errorMessage(errorValue, this.label);
      }

      return errorMessage;
    });
  }

  private toggleErrorVisibility(messages: string[]): void {
    const errorContainer = this.el.nativeElement.closest('.form-field').nextElementSibling;
    if (errorContainer) {
      this.renderer.setProperty(errorContainer, 'innerHTML', '');
      if (messages.length > 0) {
        this.renderer.setProperty(errorContainer, 'innerHTML', messages.join('<br>'));
        this.renderer.addClass(errorContainer, 'visible');
      } else {
        this.renderer.removeClass(errorContainer, 'visible');
      }
    }
  }
}
