import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import dayjs from 'dayjs';
import { getFormattedTime } from '../../../common/common';
import {
  FieldSlotRateData,
  SelectableSlot,
  CalendarSlot,
} from '../../../interfaces/field';
import { ButtonComponent } from '../../button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-editor',
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonToggleModule,
    ButtonComponent,
    FormsModule
  ],
  templateUrl: './calendar-editor.component.html',
  styleUrl: './calendar-editor.component.scss',
})
export class CalendarEditorComponent {
  showTable: boolean = false;
  @Input() fieldSlotAvailability: FieldSlotRateData[];
  @Input() dayView: boolean = false;
  @Input() isRateView: boolean = false;

  displayedDays: string[];
  @Output() selectedSlotsEvent = new EventEmitter<{
    [key: string]: SelectableSlot[];
  }>();

  today = dayjs();
  currentDate = dayjs();
  selectedSlots: { [key: string]: SelectableSlot[] } = {};
  displayedColumns: string[] = [];
  slots: CalendarSlot[];
  rateInput: number | null = null; 


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
          status: res.status,
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

      if (availability && !status) {
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

    return {
      selected: isSelected,
      available: !isSelected && status === 'available',
      booked: status === 'booked',
      past: status === 'past',
      closed: status === 'closed',
      unavailable: status == 'unavailable',
    };
  }

  getSlotDisplayText(day: string, slot: CalendarSlot): string {
    const slotStatus = this.getSlotStatus(day, slot);

    switch (slotStatus.status) {
      case 'selected':
        return slotStatus.rate;
      case 'available':
        return this.isRateView ? slotStatus.rate ?? '-' : 'Available';
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
    if (this.isRateView && this.rateInput !== null) {
      this.updateSelectedSlotsRate(); 
    } else {
      this.updateSelectedSlotsAvailability();
    }
  }

  removeAll() {
    this.selectedSlots = {};
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
    return fieldSlot.slots.some(
      (slot) =>
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
      const slotDateTime = dayjs(
        `${day} ${slot.startTime}`,
        'YYYY-MM-DD hh:mm A'
      );

      if (
        slot.availability &&
        slot.status !== 'Closed' &&
        slot.status !== 'Booked' &&
        !(isPastDay || (day === todayDate && slotDateTime.isBefore(now))) // Ignore past time slots
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
          this.selectedSlots[key].push({
            slotGuid: slot.slotId,
            date: day,
            rate,
          });
        }
      }
    });

    this.selectedSlots = { ...this.selectedSlots };
  }

  updateSelectedSlotsRate() {
    Object.values(this.selectedSlots).forEach((slots) => {
      slots.forEach((slot) => {
        slot.rate = this.rateInput ?? slot.rate;
      });
    });
    this.selectedSlotsEvent.emit(this.selectedSlots);
  }

  updateSelectedSlotsAvailability() {
    Object.values(this.selectedSlots).forEach((slots) => {
      slots.forEach((slot) => {
        slot.availability = false;
      });
    });
    this.selectedSlotsEvent.emit(this.selectedSlots);
  }
}
