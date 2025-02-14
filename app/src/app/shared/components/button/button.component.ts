import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() public text: string = '';
  @Input() public buttonType: 'normal' | 'outline' | 'icon' | 'flat' | 'text-icon' = 'normal';
  @Input() public color: 'primary' | 'secondary' = 'primary';
  @Output() public buttonClick = new EventEmitter<void>();

  onClick(): void {
    this.buttonClick.emit();
  }
}
