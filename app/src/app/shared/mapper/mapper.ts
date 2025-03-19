import dayjs from 'dayjs';
import { getFormattedTime } from '../common/common';
import { Day, DialogTable, NewSlot, SelectableSlot, Slot } from '../interfaces/field';

export function convertSelectableSlotsToDialogTable(
  selectedSlots: { [key: string]: SelectableSlot[] },
  slots: Slot[],
  days: Day[]
): DialogTable[] {
  const flattenedSlots: SelectableSlot[] = Object.values(selectedSlots).flat();

  return flattenedSlots.map((selectedSlot) => {
    const slotDetails = slots.find(
      (slot) => slot.guid === selectedSlot.slotGuid
    );
    const dayDetails = days.find((day) => day.guid === selectedSlot.dayGuid);

    return {
      timeSlot: slotDetails
        ? `${slotDetails.startTime} - ${slotDetails.endTime}`
        : 'N/A',
      date: selectedSlot.date,
      day: dayDetails ? dayDetails.description : 'N/A',
      rate: selectedSlot.rate,
    };
  });
}

export function convertSelectableSlotToDialogTable(
  selectedSlots: { [key: string]: SelectableSlot[] },
  slots: NewSlot[],
): DialogTable[] {
  const flattenedSlots: SelectableSlot[] = Object.values(selectedSlots).flat();

  return flattenedSlots.map((selectedSlot) => {
    const slotDetails = slots.find(
      (slot) => slot.slotId === selectedSlot.slotGuid
    );

    return {
      timeSlot: slotDetails
        ? `${getFormattedTime(slotDetails.startTime)} - ${getFormattedTime(slotDetails.endTime)}`
        : 'N/A',
      date: selectedSlot.date,
      day: dayjs(selectedSlot.date).format("dddd"),
      rate: selectedSlot.rate,
    };
  });
}
