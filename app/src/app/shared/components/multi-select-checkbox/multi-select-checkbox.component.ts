import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

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
  @Input() placeholder: string = 'Select options';
  @Input() disabled: boolean = false;
  
  @Output() selectionChange = new EventEmitter<(string | number)[]>();

  selectedValues: (string | number)[] = [];

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

  toggleSelection(value: string | number): void {
    const index = this.selectedValues.indexOf(value);
    if (index === -1) {
      this.selectedValues.push(value);
    } else {
      this.selectedValues.splice(index, 1);
    }

    this.onChange(this.selectedValues);
    this.selectionChange.emit(this.selectedValues);
  }

  isSelected(value: string | number): boolean {
    return this.selectedValues.includes(value);
  }
}
