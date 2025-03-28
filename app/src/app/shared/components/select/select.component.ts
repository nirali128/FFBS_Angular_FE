import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { DropdownOption } from '../../interfaces/dropdown.options';
import { MatOption, MatSelectChange, MatSelectModule } from '@angular/material/select'
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormErrorsDirective } from '../../directives/form-error.directive';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, MatOption, MatSelectModule, ReactiveFormsModule, FormErrorsDirective],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = ''; 
  @Input() label: string = '';
  @Input() selectedValue: string | number | null = null;
  @Input() formControl!: FormControl; 
  @Output() selectionChange = new EventEmitter<string | number>();  
  @Input() formControlName?: string;

  @Input() disabled: boolean = false;

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (value !== undefined) {
      this.selectedValue = value;
    }
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
    this.onChange(event.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
