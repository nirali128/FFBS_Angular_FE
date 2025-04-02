import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogResponse as DialogResponse, iDialogField } from '../../interfaces/dialog-fields';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { TextareaComponent } from '../text-area/text-area.component';
import { MatError } from '@angular/material/form-field';


@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, ButtonComponent, CommonModule, TextareaComponent, MatError],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
  requiresReason: boolean;
  reasonControl: FormControl;
  dialogResponse: DialogResponse;
  submitted: boolean = false;

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: iDialogField) {
    this.title = data.title!;
    this.message = data.message;
    this.btnOkText = data.btnOkText ? data.btnOkText : "Yes";
    this.btnCancelText = data.btnCancelText ? data.btnCancelText : "No";
    this.requiresReason = data.requiresReason || false;
    this.reasonControl = new FormControl('', this.requiresReason ? Validators.required : []);
    this.dialogResponse = {
      confirmed: false
    }
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
    this.dialogResponse.confirmed = true;
    this.dialogRef.close(this.dialogResponse);
  }

  onDismiss() {
    this.reasonControl.disable();
    this.reasonControl.updateValueAndValidity()
    this.dialogResponse.confirmed = false;
    this.dialogRef.close(this.dialogResponse);
  }

  onSubmitReason() {
    this.submitted = true;
    this.dialogResponse.confirmed = true;
    if (this.reasonControl.value.trim()) {
      this.dialogResponse.reason = this.reasonControl.value;
      this.dialogRef.close(this.dialogResponse);
    }
  }
}