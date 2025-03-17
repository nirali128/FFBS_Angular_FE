import { Day, DialogTable, SelectableSlot, Slot } from '../interfaces/field';

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
