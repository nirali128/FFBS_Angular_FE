import { Component } from '@angular/core';
import { FieldService } from '../../../../shared/service/field.service';
import {
  Booking,
  BookingDetail,
  Day,
  FieldDetail,
  FieldSlotRateData,
  FieldSlotRateRequestData,
  SelectableSlot,
  Slot,
} from '../../../../shared/interfaces/field';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/service/authentication.service';
import { MatIcon } from '@angular/material/icon';
import { ApiResponse } from '../../../../shared/interfaces/api.response';

import dayjs from 'dayjs';
import { catchError, forkJoin, of } from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { CalendarComponent } from '../../../../shared/components/calendar/calendar.component';
import { Role } from '../../../../shared/enum/role';
import { SnackbarService } from '../../../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../../../shared/constants/snackbar-config.const';
import { BookingService } from '../../../../shared/service/booking.service';
import { UserService } from '../../../../shared/service/user.service';
import { DropdownOption } from '../../../../shared/interfaces/dropdown.options';
import { mapUserToDropdown } from '../../../../shared/utility/utilitty';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { FilterRequest } from '../../../../shared/interfaces/filter-request';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { MatDialog } from '@angular/material/dialog';
import { FieldReviewDialogComponent } from './field-review-dialog/field-review-dialog.component';

@Component({
  selector: 'app-field-booking',
  imports: [
    CalendarComponent,
    CommonModule,
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule,
    ButtonComponent,
    SelectComponent,
    NgxStarRatingModule,
  ],
  templateUrl: './field-booking.component.html',
  styleUrl: './field-booking.component.scss',
})
export class FieldBookingComponent {
  days: Day[];
  slots: Slot[];
  fieldId: string;
  field: FieldDetail;
  startDate: Date;
  endDate: Date;
  maxDate: Date;
  fieldSlotAvailability: FieldSlotRateData[];
  fieldSlotRate: FieldSlotRateData[];
  fieldSlot: FieldSlotRateData[];
  dayView: boolean = false;
  toggleSlideLabel: string = 'Toggle for single day booking';
  minimumStartDate: Date;
  closedDays: Day[];
  isAdmin: boolean = false;
  userFormControl: FormControl = new FormControl('', [Validators.required]);
  userOptions: DropdownOption[] = [];
  fieldBookings: any;

  constructor(
    private readonly fieldService: FieldService,
    private readonly bookingService: BookingService,
    private route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly snackbarService: SnackbarService,
    private router: Router,
    private readonly userService: UserService,
    private dialog: MatDialog
  ) {
    this.route.params.subscribe((params) => {
      this.fieldId = params['id'];
    });
    this.maxDate = dayjs().add(2, 'month').toDate();
    this.isAdmin = this.authService.getRole() == Role.Admin ? true : false;
    let filterRequest: FilterRequest = {
      search: Role.Customer,
    };
    this.userService.getPaginatedUsers(filterRequest).subscribe((res) => {
      if (res.success) {
        this.userOptions = mapUserToDropdown(res.data);
      }
    });
  }

  ngOnInit() {
    this.fieldService
      .getFieldById(this.fieldId)
      .subscribe((res: ApiResponse<FieldDetail>) => {
        if (res.success) {
          this.field = res.data;
          this.field.averageRating = Math.round(res.data.averageRating);
        }
      });
  }

  generateDateRange() {
    let arr = [];
    let start = dayjs(this.startDate, 'YYYY-MM-DD');
    if (this.startDate && this.endDate && !this.dayView) {
      const end = dayjs(this.endDate, 'YYYY-MM-DD');
      const dates: string[] = [];

      while (start.isBefore(end) || start.isSame(end, 'day')) {
        arr.push(start.format('YYYY-MM-DD'));
        start = start.add(1, 'day');
      }
    } else {
      arr.push(start.format('YYYY-MM-DD'));
    }

    let data: FieldSlotRateRequestData = {
      fieldId: this.fieldId,
      date: arr,
    };

    forkJoin({
      day: this.fieldService.getAllDays(),
      closedDays: this.fieldService.getClosedDays(this.fieldId),
      fieldSlotAvailability: this.fieldService.getFieldSlotsAvailability(data),
      fieldSlotRates: this.fieldService.getFieldSlotsRates(data),
    }).subscribe((res) => {
      if (res.fieldSlotRates.success)
        this.fieldSlotRate = res.fieldSlotRates.data;
      if (res.fieldSlotAvailability.success)
        this.fieldSlotAvailability = res.fieldSlotAvailability.data;
      if (res.day.success) this.days = res.day.data;
      if (res.closedDays.success) this.closedDays = res.closedDays.data;

      this.generateFieldSlotRate();
    });

    if (!this.isAdmin)
      this.bookingService
        .getAllBookingByFieldIdUserId(this.fieldId)
        .subscribe((res) => {
          if (res.success) {
            this.fieldBookings = res.data;
          } else {
            this.fieldBookings = [];
          }
        });
  }

  generateFieldSlotRate() {
    if (
      ((this.dayView && this.startDate) || this.endDate) &&
      this.fieldSlotRate &&
      this.fieldSlotAvailability
    ) {
      this.fieldSlotAvailability.map((res) => {
        const rateItem = this.fieldSlotRate.find(
          (rate) => rate.date == res.date
        );

        if (rateItem) {
          res.slots.forEach((avalSlot) => {
            const matchingSlot = rateItem.slots.find(
              (rateSlot) => rateSlot.slotId === avalSlot.slotId
            );

            if (matchingSlot) {
              avalSlot.rate = matchingSlot.rate;
            }
          });
        }

        if (this.closedDays) {
          let day = this.closedDays.find(
            (d) => d.description == dayjs(res.date).format('dddd')
          );

          if (day) {
            res.slots.map((res) => {
              res.availability = false;
              res.status = 'Closed';
            });
          }
        }
      });
      this.fieldSlot = this.fieldSlotAvailability;
    }
  }

  selectedDaysEvent(event: [string[], boolean]) {
    const [dateArr, isDayView] = event;
    if (dateArr.length && isDayView) {
      this.startDate = new Date(dateArr[0]);
    } else {
      const selectedDate = dayjs(dateArr[0]);
      const dayOfWeek = selectedDate.day();

      // Calculate the Monday of the current week
      const startOfWeek = selectedDate.subtract(dayOfWeek - 1, 'days');
      const endOfWeek = startOfWeek.add(6, 'days');

      this.startDate = startOfWeek.toDate();
      this.endDate = endOfWeek.toDate();
    }
    this.dayView = isDayView;
    this.generateDateRange();
  }

  selectedEvents(items: { [key: string]: SelectableSlot[] }) {
    if (!items || Object.keys(items).length === 0) return;

    const bookingDetails: BookingDetail[] = [];
    let totalPrice: number = 0;

    Object.values(items).forEach((slots) => {
      slots.forEach((item) => {
        const bookingDate = item.date;

        let bookingDetail = bookingDetails.find(
          (b) => b.bookingDate === bookingDate
        );

        let day = this.days.find(
          (d) => d.description == dayjs(bookingDate).format('dddd')
        );

        if (!bookingDetail) {
          bookingDetail = {
            bookingDate: bookingDate,
            slots: [],
            dayId: day.guid,
          };
          bookingDetails.push(bookingDetail);
        }

        if (!bookingDetail.slots.includes(item.slotGuid)) {
          bookingDetail.slots.push(item.slotGuid);
          totalPrice += Number(item.rate);
        }
      });
    });

    const booking: Booking = {
      userId: this.isAdmin
        ? this.userFormControl.value
        : this.authService.getUserId(),
      fieldId: this.fieldId,
      totalPrice: totalPrice,
      isLongTermBooking: true,
      isDirectBooking: this.isAdmin,
      bookingDetails,
    };

    this.bookingService.addBooking(booking).subscribe((res) => {
      if (res.success) {
        this.snackbarService.show(new SnackbarConfig({ message: res.message }));
      }
      this.fieldSlot = [];
      this.generateDateRange();
    });
  }

  navigate() {
    this.router.navigateByUrl('field');
  }

  openDialog() {
    this.dialog.open(FieldReviewDialogComponent, {
      data: this.fieldId,
      width: '50%',
    });
  }
}
