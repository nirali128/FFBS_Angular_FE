import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { iDialogField } from '../../interfaces/dialog-fields';


@Component({
  selector: 'app-dialog',
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