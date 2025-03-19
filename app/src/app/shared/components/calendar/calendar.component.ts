import { Component, EventEmitter, Input, Output } from '@angular/core';
import dayjs from 'dayjs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { getFormattedTime } from '../../common/common';
import { FieldSlotRateData, SelectableSlot, CalendarSlot } from '../../interfaces/field';
import { convertSelectableSlotToDialogTable } from '../../mapper/mapper';
import { ButtonComponent } from '../button/button.component';
import { DialogComponent } from './dialog/dialog.component';


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
  @Input() dayView: boolean = false;

  displayedDays: string[];
  @Output() selectedSlotsEvent = new EventEmitter<{
    [key: string]: SelectableSlot[];
  }>();

  today = dayjs();
  currentDate = dayjs();
  selectedSlots: { [key: string]: SelectableSlot[] } = {};
  displayedColumns: string[] = [];
  slots: CalendarSlot[];

  constructor(public dialog: MatDialog) {}

  ngOnChanges() {
    this.getDays();
    this.getSlots();
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
        };
        this.slots.push(data);
      });
    }
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
      if (!slotData.availability) return { status: 'booked' };
      if (
        (isPastDay && slotData.availability) ||
        (isToday && parsedTime.isBefore(now))
      )
        return { status: 'past' };
      return { status: 'available', rate: slotData.rate.toString() };
    }
    return { status: 'unavailable' };
  }

  getSlotClass(day: string, slot: CalendarSlot): { [key: string]: boolean } {
    const key = `${day}-${slot.slotId}`;
    const status = this.getSlotStatus(day, slot).status;
    const isSelected = this.selectedSlots[key]?.some(
      (selectedSlot) => selectedSlot.slotGuid === slot.slotId
    );

    return {
      selected: isSelected,
      available: !isSelected && status === 'available',
      booked: status === 'booked',
      past: status === 'past',
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
}
