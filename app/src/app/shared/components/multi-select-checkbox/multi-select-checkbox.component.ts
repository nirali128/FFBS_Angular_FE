import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-multi-select-checkbox',
  imports: [CommonModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './multi-select-checkbox.component.html',
  styleUrl: './multi-select-checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectCheckboxComponent),
      multi: true
    }
  ]
})
export class MultiSelectCheckboxComponent implements ControlValueAccessor {
  @Input() options: { value: string | number; label: string }[] = [];
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() placeholder: string = ''; 
  
  @Output() selectionChangeEvent = new EventEmitter<(string | number)[]>();

  @Input() selectedValues: (string | number)[] = [];

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.selectedValues = value || [];
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectionChange(event: MatSelectChange): void {
    this.selectedValues = event.value;
    this.onChange(this.selectedValues);
    this.selectionChangeEvent.emit(this.selectedValues);
  }
}