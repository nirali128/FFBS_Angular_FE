import { Component, EventEmitter, Input, Output } from '@angular/core';
import dayjs from 'dayjs';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Day, SelectableSlot, Slot, SlotByField } from '../../interfaces/field';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { convertSelectableSlotsToDialogTable } from '../../mapper/mapper';

interface CalendarDay extends Day {
  id: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatButtonToggleModule, MatIcon],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  isDayView: boolean = false;
  showTable: boolean = false;
  @Input() days: Day[] = [];
  @Input() slots: Slot[] = [];
  @Input() slotsByField: SlotByField[] = [];
  displayedDays: CalendarDay[];
  @Output() selectedSlotsEvent = new EventEmitter<{
    [key: string]: SelectableSlot[];
  }>();

  today = dayjs();
  currentDate = dayjs();
  selectedSlots: { [key: string]: SelectableSlot[] } = {};
  displayedColumns: string[] = [];

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.getDays();
  }

  getDays() {
    this.displayedDays = [];

    if (this.isDayView) {
      const selectedDate = this.currentDate.format('YYYY-MM-DD');
      const selectedDayName = this.currentDate.format('dddd');
      const matchingDay = this.days.find(
        (day) => day.description === selectedDayName
      );

      if (matchingDay) {
        this.displayedDays.push({
          id: crypto.randomUUID(),
          guid: matchingDay.guid,
          description: matchingDay.description,
          date: selectedDate,
        } as CalendarDay);
      }
    } else {
      const startOfWeek = this.currentDate.startOf('week').add(1, 'day');

      this.displayedDays = this.days.slice(0, 7).map(
        (day, index) =>
          ({
            id: crypto.randomUUID(),
            guid: day.guid,
            description: day.description,
            date: startOfWeek.add(index, 'day').format('YYYY-MM-DD'),
          } as CalendarDay)
      );
    }
  }

  generateGuid(): string {
    return crypto.randomUUID();
  }

  isTodayButtonDisabled(): boolean {
    if (this.isDayView) {
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
    this.getDays();
  }

  navigate(offset: number): void {
    if (this.isDayView) {
      this.currentDate = this.currentDate.add(offset, 'day');
    } else {
      this.currentDate = this.currentDate.add(offset * 7, 'day');
    }

    this.getDays();
  }

  toggleView(isDay: boolean): void {
    this.isDayView = isDay;
    this.getDays();
  }

  handleSlotClick(dayGuid: string, slotGuid: string, date: string) {
    const key = `${dayGuid}-${date}-${slotGuid}`;

    if (!this.selectedSlots[key]) {
      this.selectedSlots[key] = [];
    }

    const index = this.selectedSlots[key].findIndex(
      (slot) => slot.slotGuid === slotGuid
    );

    let rate = this.getSlotRate(dayGuid, slotGuid);
    if (index === -1) {
      this.selectedSlots[key].push({ dayGuid, slotGuid, date, rate });
    } else {
      this.selectedSlots[key].splice(index, 1);
    }

    this.selectedSlots = { ...this.selectedSlots };
  }

  getSlotRate(dayGuid: string, slotGuid: string): number {
    const fieldSlot = this.slotsByField.find((f) => f.dayId === dayGuid);
    const slotData = fieldSlot?.slots.find((s) => s.slotId === slotGuid);
    return slotData.rate;
  }

  getSlotStatus(
    day: CalendarDay,
    slot: Slot
  ): { status: string; rate?: string } {
    const fieldSlot = this.slotsByField.find((f) => f.dayId === day.guid);
    const slotData = fieldSlot?.slots.find((s) => s.slotId === slot.guid);

    const dayDate = dayjs(day.date, 'YYYY-MM-DD', true);
    const isToday = dayDate.isSame(this.today, 'day');
    const isPastDay = dayDate.isBefore(this.today, 'day');
    const slotStartTime = dayjs(slot.startTime, 'hh:mm A');

    if (slotData) {
      if (!slotData.isAvailable) return { status: 'booked' };
      if (
        (isPastDay && slotData.isAvailable) ||
        (isToday && slotStartTime.isBefore(this.today))
      )
        return { status: 'past' };
      return { status: 'available', rate: slotData.rate.toString() };
    }
    return { status: 'unavailable' };
  }

  getSlotClass(day: CalendarDay, slot: Slot): { [key: string]: boolean } {
    const key = `${day.guid}-${day.date}-${slot.guid}`;
    const status = this.getSlotStatus(day, slot).status;
    const isSelected = this.selectedSlots[key]?.some(
      (selectedSlot) => selectedSlot.slotGuid === slot.guid
    );

    return {
      selected: isSelected,
      available: !isSelected && status === 'available',
      booked: status === 'booked',
      past: status === 'past',
    };
  }

  getSlotDisplayText(day: CalendarDay, slot: Slot): string {
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
    let dialogData = convertSelectableSlotsToDialogTable(
      this.selectedSlots,
      this.slots,
      this.days
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
}
