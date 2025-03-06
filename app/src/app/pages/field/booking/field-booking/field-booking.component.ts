import { Component } from '@angular/core';
import { CalendarComponent } from '../../../../shared/components/calendar/calendar.component';
import { FieldService } from '../../../../shared/service/field.service';
import {
  Booking,
  BookingDetail,
  Day,
  FieldDetail,
  SelectableSlot,
  Slot,
  SlotByField,
} from '../../../../shared/interfaces/field';
import { ApiResponse } from '../../../../shared/interfaces/api.response';
import { ActivatedRoute } from '@angular/router';
import { EventInput } from '@fullcalendar/core/index.js';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../shared/service/authentication.service';

@Component({
  selector: 'app-field-booking',
  imports: [CalendarComponent, CommonModule],
  templateUrl: './field-booking.component.html',
  styleUrl: './field-booking.component.scss',
})
export class FieldBookingComponent {
  days: Day[];
  slots: Slot[];
  slotsByField: SlotByField[];
  fieldId: string;
  calendarEvents: EventInput[] = [];
  selectedDateRange: { startDate: string; endDate: string } = {
    startDate: '',
    endDate: '',
  };
  field: FieldDetail;
  booking: Booking[];

  constructor(
    public fieldService: FieldService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.route.params.subscribe((params) => {
      this.fieldId = params['id'];
    });
  }

  ngOnInit() {
    this.fieldService.getFieldById(this.fieldId).subscribe((res) => {
      if (res.success) {
        this.field = res.data;
      }
    });
    this.fieldService.getAllDays().subscribe((res: ApiResponse<Day[]>) => {
      if (res.success) {
        this.days = res.data;
      }
    });

    this.fieldService.getAllSlots().subscribe((res: ApiResponse<Slot[]>) => {
      if (res.success) {
        this.slots = res.data;
      }
    });

    this.fieldService.getAllBooking().subscribe((res) => {
      if (res.success) {
        this.booking = res.data;
      }
    });

    this.fieldService
      .getSlotsByField(this.fieldId)
      .subscribe((res: ApiResponse<SlotByField[]>) => {
        if (res.success)
          this.slotsByField = res.data.map((slotByField) => {
            const day = this.days.find((d) => d.guid === slotByField.dayId);

            slotByField.slots = slotByField.slots.map((slot) => {
              const matchingSlot = this.slots.find(
                (s) => s.guid === slot.slotId
              );
              return {
                ...slot,
                startTime: matchingSlot ? matchingSlot.startTime : undefined,
                endTime: matchingSlot ? matchingSlot.endTime : undefined,
              };
            });

            return slotByField;
          });

        console.log(this.slotsByField);
      });
  }

  onDateRangeChange(dateRange: { startDate: string; endDate: string }) {
    this.selectedDateRange = dateRange;

  }

  selectedEvents(items: { [key: string]: SelectableSlot[] }) {
    if (!items || Object.keys(items).length === 0) return;
  
    const bookingDetails: BookingDetail[] = [];
    let totalPrice: number = 0;
  
    Object.values(items).forEach((slots) => {
      slots.forEach((item) => {
        const bookingDate = item.date;
        const day = this.days.find((d) => d.guid === item.dayGuid);
        if (!day) return;
  
        let bookingDetail = bookingDetails.find((b) => b.dayId === day.guid && b.bookingDate === bookingDate);
  
        if (!bookingDetail) {
          bookingDetail = {
            dayId: day.guid,
            bookingDate: bookingDate,
            slots: [],
          };
          bookingDetails.push(bookingDetail);
        }
  
        if (!bookingDetail.slots.includes(item.slotGuid)) {
          bookingDetail.slots.push(item.slotGuid);
          totalPrice += item.rate; 
        }


      });
    });
  
    const booking: Booking = {
      userId: this.authService.getUserId(),
      fieldId: this.fieldId,
      totalPrice: totalPrice,
      isLongTermBooking: true,
      bookingDetails,
    };
  
    this.fieldService.addBooking(booking).subscribe((res) => {
    });
  }
  
}
