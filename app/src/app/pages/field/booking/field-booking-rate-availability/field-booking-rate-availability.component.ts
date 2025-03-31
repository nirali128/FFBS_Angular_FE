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
import { forkJoin } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { CalendarEditorComponent } from '../../../../shared/components/calendar/calendar-editor/calendar-editor.component';
import { SnackbarService } from '../../../../shared/service/snackbar.service';
import { SnackbarConfig } from '../../../../shared/constants/snackbar-config.const';

@Component({
  selector: 'app-field-booking-rate-availability',
  imports: [
    CalendarEditorComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule,
    ButtonComponent,
  ],
  templateUrl: './field-booking-rate-availability.component.html',
  styleUrl: './field-booking-rate-availability.component.scss',
})
export class FieldBookingRateAvailabilityComponent {
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
  isRateView: boolean = false;

  constructor(
    public readonly fieldService: FieldService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBarService: SnackbarService
  ) {
    this.route.params.subscribe((params) => {
      this.fieldId = params['id'];
      this.isRateView = this.route.snapshot.url[0].path === 'rate';
    });

    this.maxDate = dayjs().add(2, 'month').toDate();
  }

  ngOnInit() {
    this.fieldService
      .getFieldById(this.fieldId)
      .subscribe((res: ApiResponse<FieldDetail>) => {
        if (res.success) {
          this.field = res.data;
        }
      });
  }

  startDateChange(event: any) {
    if (event.value) {
      this.startDate = event.value;
      this.generateDateRange();
      this.minimumStartDate = new Date(this.startDate);
      this.minimumStartDate.setDate(this.startDate.getDate() + 1);
    }
  }

  endDateChange(event: any) {
    if (event.value) {
      this.endDate = event.value;
      this.generateDateRange();
    }
  }

  generateDateRange() {
    let arr = [];
    let start = dayjs(this.startDate, 'YYYY-MM-DD');
    if (this.startDate && this.endDate) {
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

  toggleChange(event: MatSlideToggleChange) {
    this.dayView = event.checked;
    this.toggleSlideLabel = this.dayView
      ? 'Toggle for multiple days booking'
      : 'Toggle for single day booking';
    if (this.dayView) {
      this.endDate = null;
    }
    this.fieldSlot = [];
    this.generateDateRange();
  }

  selectedEvents(items: { [key: string]: SelectableSlot[] }) {
    if (!items || Object.keys(items).length === 0) return;

    const datesMap = new Map<string, { date: string; dayId: string | null; slots: any[] }>();

  Object.values(items).forEach((slots) => {
    const bookingDate = slots[0].date;
    const day = this.days.find((d) => d.description === dayjs(bookingDate).format('dddd'));

    if (!datesMap.has(bookingDate)) {
      datesMap.set(bookingDate, {
        date: bookingDate,
        dayId: day?.guid || null,
        slots: [],
      });
    }

    slots.forEach((item) => {
      const fieldSlotData = this.fieldSlot.find((slotData) => slotData.date === bookingDate);
      const matchingSlot = fieldSlotData?.slots.find((slot) => slot.slotId === item.slotGuid);

      const slotData = this.isRateView
        ? {
            slotId: item.slotGuid,
            oldRate: parseFloat((matchingSlot?.rate ?? 0).toString()),
            adjustedRate: parseFloat(item.rate.toString()),
          }
        : {
            slotId: item.slotGuid,
            isAvailable: item.availability,
          };

      datesMap.get(bookingDate)?.slots.push(slotData);
    });
  });

    const requestData = {
      fieldId: this.fieldId,
      rateType: 'duration',
      dates: Array.from(datesMap.values()),
    };

    if (this.isRateView) {
      this.fieldService.addFieldSlotsRates(requestData).subscribe((res) => {
        if (res.success) {
          this.snackBarService.show(
            new SnackbarConfig({ message: res.message })
          );
          this.fieldSlot = [];
          this.generateDateRange();
        }
      });
    } else {
      this.fieldService
        .addFieldSlotsAvailability(requestData)
        .subscribe((res) => {
          if (res.success) {
            this.snackBarService.show(
              new SnackbarConfig({ message: res.message })
            );
            this.fieldSlot = [];
            this.generateDateRange();
          }
        });
    }
  }

  navigate() {
    this.router.navigateByUrl('field');
  }
}
