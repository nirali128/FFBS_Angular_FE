import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { TextareaComponent } from '../../../../../shared/components/text-area/text-area.component';

@Component({
  selector: 'app-feedback-rating-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    ButtonComponent,
    CommonModule,
    NgxStarRatingModule,
    TextareaComponent,
  ],
  templateUrl: './feedback-rating-dialog.component.html',
  styleUrl: './feedback-rating-dialog.component.scss',
})
export class FeedbackRatingDialogComponent {
  feedbackForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<FeedbackRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: string },
    private formBuilder: FormBuilder
  ) {
    this.feedbackForm = this.formBuilder.group({
      bookingId: [data.bookingId],
      feedbackText: ['', [Validators.required, Validators.maxLength(100)]],
      rating: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.feedbackForm.get(controlName) as FormControl;
  }

  submitFeedback() {
    if (this.feedbackForm.valid) {
      this.dialogRef.close(this.feedbackForm.value);
    } else {
      this.feedbackForm.markAllAsTouched();
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
