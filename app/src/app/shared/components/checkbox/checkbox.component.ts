import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [MatCheckboxModule],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {
    @Input() public label: string = '';
    @Input() public checked: boolean = false;
    @Input() public disabled: boolean = false;
    @Input() public size: 'small' | 'large' = 'small';
    @Input() public color: 'primary' | 'accent' | 'warn' = 'primary';

    @Output() public checkedChange = new EventEmitter<boolean>();

    onChange(event: MatCheckboxChange): void {
        this.checked = event.checked;
        this.checkedChange.emit(this.checked);
    }
}
