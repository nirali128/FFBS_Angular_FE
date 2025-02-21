import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { SnackbarConfig } from '../../constants/snackbar-config.const';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
  imports: [MatIcon],
})
export class SnackbarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackbarConfig) { }

  closeSnackbar() {
    this.data._snackbar?.dismiss();
  }
}