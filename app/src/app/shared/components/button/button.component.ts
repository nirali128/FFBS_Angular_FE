import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() public text: string = '';
  @Input() public buttonType: 'normal' | 'outline' | 'icon' | 'flat' | 'text-icon' = 'normal';
  @Input() public color: 'btn btn-info' | 'btn btn-danger' = 'btn btn-info';
  @Output() public buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
