import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatError, MatLabel, CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() formControl: FormControl | null = null;
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() errorMessages: { [key: string]: string } = {};
  @Input() disabled: boolean = false;

  value: any = '';
  constructor() {}

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // Write value method to set the value
  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // Register the change callback function
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  // Register the touched callback function
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Optional: Handling the disabled state of the control
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Trigger change event
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.onChange(input.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
