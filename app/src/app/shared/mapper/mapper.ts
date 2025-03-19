import dayjs from 'dayjs';
import { getFormattedTime } from '../common/common';
import { DialogTable, NewSlot, SelectableSlot } from '../interfaces/field';

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
