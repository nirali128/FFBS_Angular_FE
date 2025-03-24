import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogTable } from '../../../interfaces/field';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  dialogTableData: DialogTable[];
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: DialogTable[],
    private dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.dialogTableData = data;
  } 

  bookNow(isConfirmed: boolean) {
    this.dialogRef.close(isConfirmed);
  }
}