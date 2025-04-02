import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import dayjs from 'dayjs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { getFormattedTime } from '../../common/common';
import {
  FieldSlotRateData,
  SelectableSlot,
  CalendarSlot,
} from '../../interfaces/field';
import { convertSelectableSlotToDialogTable } from '../../mapper/mapper';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from './dialog/dialog.component';
import { AuthService } from '../../service/authentication.service';
import { Role } from '../../enum/role';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonToggleModule,
    ButtonComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  showTable: boolean = false;
  @Input() fieldSlotAvailability: FieldSlotRateData[];
  dayView: boolean = false;
  @Input() fieldBookings: any;

  displayedDays: string[];
  @Output() selectedSlotsEvent = new EventEmitter<{
    [key: string]: SelectableSlot[];
  }>();

  today = dayjs();
  currentDate = dayjs();
  selectedSlots: { [key: string]: SelectableSlot[] } = {};
  displayedColumns: string[] = [];
  slots: CalendarSlot[];
  @Output() selectedDaysEvent = new EventEmitter<[string[], boolean]>();
  isAdmin: boolean = false;

  constructor(public dialog: MatDialog, public readonly authService: AuthService) {
    this.isAdmin = this.authService.getRole() == Role.Admin ? true : false;
  }

  ngAfterViewInit() {
    this.selectedDaysEvent.emit([[this.currentDate.format('YYYY-MM-DD')], this.dayView])
  }

  ngOnChanges() {
    this.removeAll()
    this.getDays();
    this.getSlots();
  }

  isSlotBookedByUser(day: string, slot: CalendarSlot): boolean {
    return this.fieldBookings && this.fieldBookings.some((booking: any) => {
      return booking.bookingDetails.some((detail: any) => {
        const formattedBookingDate = detail.bookingDate.split('T')[0];
        // Check if the booking's date matches and the slot is in the booking's slots array
        return formattedBookingDate == day && 
        detail.slots.some((slotDetail: any) => slotDetail === slot.slotId);
      });
    });
  }

  getDays() {
    this.displayedDays = [];
    if (this.fieldSlotAvailability) {
      this.fieldSlotAvailability.forEach((res) => {
        this.displayedDays.push(res.date);
      });
    }
  }

  getSlots() {
    this.slots = [];
    if (this.fieldSlotAvailability) {
      this.fieldSlotAvailability[0].slots.forEach((res) => {
        let data: CalendarSlot = {
          slotId: res.slotId,
          startTime: res.startTime,
          endTime: res.endTime,
          status: res.status,
        };
        this.slots.push(data);
      });
    }
  }

  isTodayButtonDisabled(): boolean {
    if (this.dayView) {
      return this.currentDate.isSame(dayjs(), 'day');
    } else {
      const startOfCurrentWeek = dayjs().startOf('week').add(1, 'day');
      const startOfDisplayedWeek = this.currentDate
        .startOf('week')
        .add(1, 'day');

      return startOfDisplayedWeek.isSame(startOfCurrentWeek, 'day');
    }
  }

  goToToday() {
    this.currentDate = dayjs();
    this.selectedDaysEvent.emit([[this.currentDate.format('YYYY-MM-DD')], this.dayView])
  }

  navigate(offset: number): void {
    if (this.dayView) {
      this.currentDate = this.currentDate.add(offset, 'day');
    } else {
      this.currentDate = this.currentDate.add(offset * 7, 'day');
    }
    this.selectedDaysEvent.emit([[this.currentDate.format('YYYY-MM-DD')], this.dayView])
  }

  
  toggleView(isDay: boolean): void {
    this.dayView = isDay;
    this.selectedDaysEvent.emit([[this.currentDate.format('YYYY-MM-DD')], this.dayView])
  }

  handleSlotClick(slotGuid: string, date: string) {
    const key = `${date}-${slotGuid}`;

    if (!this.selectedSlots[key]) {
      this.selectedSlots[key] = [];
    }

    const index = this.selectedSlots[key].findIndex(
      (slot) => slot.slotGuid === slotGuid
    );

    let rate = this.getSlotRate(date, slotGuid);
    if (index === -1) {
      this.selectedSlots[key].push({ slotGuid, date, rate });
    } else {
      this.selectedSlots[key].splice(index, 1);
    }

    this.selectedSlots = { ...this.selectedSlots };
  }

  getSlotRate(date: string, slotGuid: string): number {
    const fieldSlot = this.fieldSlotAvailability.find((f) => f.date == date);
    const slotData = fieldSlot?.slots.find((s) => s.slotId === slotGuid);
    return slotData.rate;
  }

  getFormattedTimeString(timeString: string): string {
    return getFormattedTime(timeString);
  }

  getSlotStatus(
    day: string,
    slot: CalendarSlot
  ): { status: string; rate?: string } {
    const fieldSlot = this.fieldSlotAvailability.find((f) => f.date === day);
    const slotData = fieldSlot?.slots.find((s) => s.slotId === slot.slotId);

    const dayDate = dayjs(day, 'YYYY-MM-DD', true);
    const isToday = dayDate.isSame(this.today, 'day');
    const isPastDay = dayDate.isBefore(this.today, 'day');
    const slotStartTime = dayjs(slot.startTime, 'hh:mm A');

    const todayDate = dayjs().format('YYYY-MM-DD');
    const now = dayjs(); // Get current date & time

    const parsedTime = dayjs(
      `${todayDate} ${slot.startTime}`,
      'YYYY-MM-DD hh:mm A'
    );

    if (slotData) {
      const { availability, status, rate } = slotData;
      if (status === 'Closed') {
        return { status: 'closed' };
      }

      if (!availability && (status === 'Confirmed' || status === 'Pending')) {
        return { status: 'booked' };
      }

      if (
        availability &&
        !status &&
        (isPastDay || (isToday && parsedTime.isBefore(now)))
      ) {
        return { status: 'past' };
      }

      if (availability && (!status || status === 'Cancelled')) {
        return { status: 'available', rate: rate?.toString() };
      }

      if (!availability && !status) {
        return { status: 'unavailable' };
      }
    }
    return { status: 'unavailable' };
  }

  getSlotClass(day: string, slot: CalendarSlot): { [key: string]: boolean } {
    const key = `${day}-${slot.slotId}`;
    const status = this.getSlotStatus(day, slot).status;
    const isSelected = this.selectedSlots[key]?.some(
      (selectedSlot) => selectedSlot.slotGuid === slot.slotId
    );

    const isBookedByUser = this.isSlotBookedByUser(day, slot); 

    return {
      selected: isSelected,
      available: !isSelected && status === 'available',
      userBooked: isBookedByUser,
      booked: status === 'booked' && !isBookedByUser,
      past: status === 'past',
      closed: status === 'closed',
      unavailable: status == 'unavailable'
    };
  }

  getSlotDisplayText(day: string, slot: CalendarSlot): string {
    const slotStatus = this.getSlotStatus(day, slot);

    switch (slotStatus.status) {
      case 'selected':
        return slotStatus.rate;
      case 'available':
        return slotStatus.rate ?? '-';
      case 'booked':
        return 'Booked';
      case 'past':
        return 'Time Concluded';
      case 'closed':
        return 'Closed';
      default:
        return '-';
    }
  }

  getSelectedSlotCount(): number {
    return Object.values(this.selectedSlots).reduce(
      (count, slots) => count + slots.length,
      0
    );
  }

  bookNow() {
    this.openDialog();
  }

  openDialog() {
    let dialogData = convertSelectableSlotToDialogTable(
      this.selectedSlots,
      this.slots
    );
    const dialogRef = this.dialog.open(DialogComponent, {
      data: dialogData,
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((item) => {
      if (item) {
        this.selectedSlotsEvent.emit(this.selectedSlots);
      }
    });
  }

  removeAll() {
    this.selectedSlots = {};
  }

  getSelectedSlotTotalPrice(): number {
    let count = 0;
    Object.values(this.selectedSlots).forEach((slots) => {
      slots.forEach((x) => {
        count += Number(x.rate);
      });
    });
    return count;
  }

  isAllSlotsSelected(day: string): boolean {
    const fieldSlot = this.fieldSlotAvailability.find((f) => f.date === day);
    if (!fieldSlot) return false;
  
    return fieldSlot.slots.every(
      (slot) =>
        slot.availability &&
        slot.status !== 'Closed' &&
        slot.status !== 'Booked' &&
        this.selectedSlots[`${day}-${slot.slotId}`]
    );
  }
  
  toggleSelectAllSlots(day: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.selectAllSlotsForDay(day);
    } else {
      this.deselectAllSlotsForDay(day);
    }
  }
  
  deselectAllSlotsForDay(day: string) {
    Object.keys(this.selectedSlots).forEach((key) => {
      if (key.startsWith(day)) {
        delete this.selectedSlots[key];
      }
    });
  
    this.selectedSlots = { ...this.selectedSlots };
  }

  shouldShowCheckbox(day: string): boolean {
    const now = dayjs(); // Get current date and time
    const today = now.format('YYYY-MM-DD');
  
    // Convert day string to a comparable format
    const dayFormatted = dayjs(day, 'DD-MM-YYYY').format('YYYY-MM-DD');
  
    // Hide checkboxes for past days
    if (dayFormatted < today) {
      return false;
    }
  
    // Find slot availability for the given day
    const fieldSlot = this.fieldSlotAvailability.find((f) => f.date === day);
    
    if (!fieldSlot) return false;
  
    // Check if at least one slot is available and not concluded/booked/unavailable
    return fieldSlot.slots.some(slot => 
      slot.availability &&
      slot.status !== 'Closed' &&
      slot.status !== 'Booked' &&
      slot.status !== 'Time Concluded'
    );
  }
  
  
  selectAllSlotsForDay(day: string) {
    // Find all available slots for the given day
    const fieldSlot = this.fieldSlotAvailability.find((f) => f.date === day);
  
    if (!fieldSlot) return;
  
    const dayDate = dayjs(day, 'YYYY-MM-DD', true);
    const todayDate = dayjs().format('YYYY-MM-DD');
    const now = dayjs(); // Get current time
    const isPastDay = dayDate.isBefore(this.today, 'day');
  
    fieldSlot.slots.forEach((slot) => {
      const slotDateTime = dayjs(`${day} ${slot.startTime}`, 'YYYY-MM-DD hh:mm A');
  
      if (
        slot.availability &&
        slot.status !== 'Closed' &&
        slot.status !== 'Booked' &&
        !(isPastDay || day === todayDate && slotDateTime.isBefore(now)) // Ignore past time slots
      ) {
        const key = `${day}-${slot.slotId}`;
  
        if (!this.selectedSlots[key]) {
          this.selectedSlots[key] = [];
        }
  
        const index = this.selectedSlots[key].findIndex(
          (selectedSlot) => selectedSlot.slotGuid === slot.slotId
        );
  
        let rate = this.getSlotRate(day, slot.slotId);
  
        if (index === -1) {
          this.selectedSlots[key].push({ slotGuid: slot.slotId, date: day, rate });
        }
      }
    });
  
    this.selectedSlots = { ...this.selectedSlots };
  }  
}
