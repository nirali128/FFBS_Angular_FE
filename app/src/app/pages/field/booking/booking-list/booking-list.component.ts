import { Component, ViewChild } from '@angular/core';
import {
  BookingApproveReject,
  BookingDetailsResponseDto,
} from '../../../../shared/interfaces/field';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BookingService } from '../../../../shared/service/booking.service';
import { BookingDetailsDialogComponent } from './booking-details-dialog/booking-details-dialog.component';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SnackbarService } from '../../../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../../../shared/constants/snackbar-config.const';
import { SuccessMessages } from '../../../../shared/constants/messages-const';
import { ConfirmDialogComponent } from '../../../../shared/components/dialog/dialog.component';
import { DialogResponse, iDialogField } from '../../../../shared/interfaces/dialog-fields';
import { AuthService } from '../../../../shared/service/authentication.service';
import { FeedbackService } from '../../../../shared/service/feedback.service';
import { Role } from '../../../../shared/enum/role';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { debounceTime, Subject } from 'rxjs';
import { FeedbackRatingDialogComponent } from './feedback-rating-dialog/feedback-rating-dialog.component';
import { AddFeedback } from '../../../../shared/interfaces/feedback';
import { PaginationRequest } from '../../../../shared/interfaces/api.response';
import { FilterRequest } from '../../../../shared/interfaces/filter-request';


@Component({
  selector: 'app-booking-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    CommonModule,
    ButtonComponent
  ],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss',
})
export class BookingListComponent {
  displayedColumns: string[] = [
    'fieldName',
    'totalPrice',
    'username',
    'bookingDate',
    'status',
    'actions',
  ];
  bookingData: BookingDetailsResponseDto[];
  dataSource = new MatTableDataSource<BookingDetailsResponseDto>();
  searchKey: string = '';
  dialogData: iDialogField = {
    message: 'Do you want to delete this booking?',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  isAdmin: boolean = false;
  private filterSubject = new Subject<void>();
  filterRequest: FilterRequest;

  constructor(
    private readonly bookingService: BookingService,
    private dialog: MatDialog,
    public readonly snackBarService: SnackbarService,
    public readonly authService: AuthService,
    public readonly feedbackService: FeedbackService
  ) {
    this.isAdmin = this.authService.getRole() === Role.Admin ? true: false;
  }

  ngOnInit(): void {
    this.loadBookings();
    this.filterSubject.pipe(debounceTime(300)).subscribe(() => {
      this.loadBookings();
    });
  }

  loadBookings(): void {
    this.filterRequest = {
      pageNumber: this.paginator ? this.paginator.pageIndex + 1 : 1,
      pageSize: this.paginator ? this.paginator.pageSize : 10,
      search: this.searchKey
    };

    this.bookingService
      .getPaginatedBookings(this.filterRequest)
      .subscribe((response) => {
        if (response.success) {
          this.bookingData = response.data;
          this.dataSource.data = response.data.map((res) => {
            return {
              ...res,
              combinedBookingDate: res.bookingDetails.map(detail => {
                const date = new Date(detail.bookingDate);
                return `${date.getDate()}-${date.toLocaleString('en-US', { month: 'short' })}-${date.getFullYear()}`;
              })
              .join(', ')
            };
          });
          this.paginator.length = response.pagination.totalItems;
        }
      });
  }

  announceSortChange(sortState: Sort) {
    this.filterRequest.sortBy = sortState.active;
    this.filterRequest.sortOrder = sortState.direction;
    this.loadBookings();
  }

  applyFilter(): void {
    this.paginator.pageIndex = 0;
    this.filterSubject.next();
  }

  clearFilter(): void {
    this.searchKey = '';
    this.applyFilter();
  }

  openViewDialog(bookingId: string): void {
    const booking = this.bookingData.find((x) => x.bookingId == bookingId);
    const dialogRef = this.dialog.open(BookingDetailsDialogComponent, {
      width: '500px',
      data: booking,
    });

    dialogRef.afterClosed().subscribe((isApproved) => {
      if (typeof isApproved === 'boolean') {
        let approvedRejectData: BookingApproveReject = {
          bookingId: bookingId,
          status: isApproved ? 'Confirmed' : 'Cancelled',
        };
        this.approveRejectBooking(approvedRejectData);
      }
    });
  }

  approveRejectBooking(
    approvedRejectData: BookingApproveReject,
  ) {
    this.bookingService
      .approveOrRejectBooking(approvedRejectData)
      .subscribe((res) => {
        if(res.success) {
          this.snackBarService.show(
            new SnackbarConfig({
              message: res.message,
            })
          );
        }
        this.loadBookings()
      });
  }

  openFeedbackDialog(bookingId: string) {
    const dialogRef = this.dialog.open(FeedbackRatingDialogComponent, {
      width: '400px',
      data: { bookingId }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.feedbackService.addFeedback(result as AddFeedback).subscribe((res) => {
          if(res.success) {
            this.snackBarService.show(
              new SnackbarConfig({
                message: res.message,
              })
            );
          }
        })
      }
    });
  }

  deleteBooking(bookingId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult: DialogResponse) => {
      if (dialogResult.confirmed) {
        this.bookingService.deleteBooking(bookingId).subscribe((res) => {
          if(res.success) {
            this.snackBarService.show(
              new SnackbarConfig({
                message: res.message,
              })
            );
            this.loadBookings();
          }
          
        });
      }
    });
  }
}
