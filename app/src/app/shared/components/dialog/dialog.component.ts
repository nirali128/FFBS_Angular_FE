import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { iDialogField } from '../../interfaces/dialog-fields';
import { ButtonComponent } from '../button/button.component';


@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, ButtonComponent],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: iDialogField) {
    this.title = data.title!;
    this.message = data.message;
    this.btnOkText = data.btnOkText ? data.btnOkText : "Yes";
    this.btnCancelText = data.btnCancelText ? data.btnCancelText : "No";
  }

  ngOnInit() {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.onDismiss();
      }
    });

    this.dialogRef.backdropClick().subscribe(event => {
      this.onDismiss();
    });
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

  onDismiss() {
    this.dialogRef.close(false);
  }
}