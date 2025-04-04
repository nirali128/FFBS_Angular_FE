import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FeedbackService } from '../../../../../shared/service/feedback.service';
import { FeedbackList } from '../../../../../shared/interfaces/feedback';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field-review-dialog',
  imports: [CommonModule],
  templateUrl: './field-review-dialog.component.html',
  styleUrl: './field-review-dialog.component.scss'
})
export class FieldReviewDialogComponent {
  feedbackList: FeedbackList[];

  constructor(
    private dialogRef: MatDialogRef<FieldReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public fieldId: string,
    private readonly feedbackService: FeedbackService
  ) {
    this.feedbackService.getPaginatedFeedbacks(undefined, fieldId).subscribe((res) => {
      if(res.success) {
        this.feedbackList = res.data;
        console.log(this.feedbackList)
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
