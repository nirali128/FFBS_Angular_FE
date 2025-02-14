import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownOption } from '../../interfaces/dropdown.options';
import { MatSelectChange } from '@angular/material/select'

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss'
})
export class SelectComponent {
  @Input() options: DropdownOption[] = []; 
  @Input() placeholder: string = ''; 
  @Input() label: string = '';
  @Input() selectedValue: string | number; 
  @Output() selectionChange = new EventEmitter<string | number>(); 

  onSelectionChange(event: MatSelectChange) {
    this.selectionChange.emit(event.value);
  }
}
