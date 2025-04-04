import { Component } from '@angular/core';
import { TableComponent } from '../../../shared/components/table/table.component';
import { FeedbackService } from '../../../shared/service/feedback.service';
import { FeedbackList } from '../../../shared/interfaces/feedback';
import { FilterRequest } from '../../../shared/interfaces/filter-request';
import { iTableField } from '../../../shared/interfaces/table-fields';
import { GlobalConstant } from '../../../shared/constants/global-const';
import { SnackbarService } from '../../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../../shared/constants/snackbar-config.const';
import { AuthService } from '../../../shared/service/authentication.service';
import { Role } from '../../../shared/enum/role';

@Component({
  selector: 'app-feedback-list',
  imports: [TableComponent],
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.scss',
})
export class FeedbackListComponent {
  dataSource!: FeedbackList[];
  totalCount!: number;
  filterRequest!: FilterRequest;
  isAdmin: boolean = false;
  displayedColumns!: iTableField[];

  constructor(public readonly feedbackService: FeedbackService, public readonly snackBarService: SnackbarService, public readonly authService: AuthService) {
    this.displayedColumns = [
      {
        name: 'bookingNumber',
        label: 'Booking Number',
        type: 'label',
        sort: true,
      },
      {
        name: 'fieldName',
        label: 'Field Name',
        type: 'label',
        sort: true,
      },
      {
        name: 'feedbackText',
        label: 'Feedback',
        type: 'label',
        sort: true,
      },
      {
        name: 'rating',
        label: 'Rating',
        type: 'rating',
        sort: false
      },
      {
        name: 'action',
        label: 'Action',
        type: 'button',
        sort: false,
        arr: [
          {
            name: GlobalConstant.DELETE,
            src: 'delete',
          },
        ],
      },
    ];
    this.isAdmin = this.authService.getRole() == Role.Admin ? true : false; 

    if(this.isAdmin) {
      this.displayedColumns.splice(1, 0, {
        name: 'userName',
        label: 'User Name',
        type: 'label',
        sort: true,
      });
    } else {
      this.displayedColumns.push({
        name: 'action',
        label: 'Action',
        type: 'button',
        sort: false,
        arr: [
          {
            name: GlobalConstant.DELETE,
            src: 'delete',
          },
        ],
      },
    )
    }
  }

  getAll(filterRequest: FilterRequest) {
    if(!this.isAdmin)
      filterRequest.search = this.authService.getUsername().split(' ')[1];
    this.feedbackService
      .getPaginatedFeedbacks(filterRequest)
      .subscribe((res) => {
        if (res.success) {
          this.filterRequest = filterRequest;
          this.dataSource = res.data;
          this.totalCount = res.pagination.totalItems;
        }
      });
  }

  onDelete(element: FeedbackList) {
    this.feedbackService.deleteFeedback(element.feedbackId).subscribe((res) => {
      if (res.success) {
        this.snackBarService.show(
          new SnackbarConfig({
            message: res.message,
          })
        );
        this.getAll(this.filterRequest);
      }
    });
  }
}
