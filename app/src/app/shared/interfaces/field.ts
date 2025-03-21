import { ColumnField } from "./data.view";

export interface FieldsDetailList {
    guid: string;
    fieldName: string;
    address: string;
    area?: number;
    phoneNumber?: string;
    isAvailable: boolean;
    rulesPolicies?: string;
    description?: string;
    isActive: boolean;
    documentName?: string;
    documentDescription?: string;
}

export interface SlotByField {
    dayId: string;
    slots: {
      slotId: string;
      rate: number;
      isAvailable: boolean;
    }[];
} 

export interface Common {
    guid: string;
    description: string | undefined;
}

export interface Slot extends Common {
    startTime: string;
    endTime: string;
    selected?: boolean;
}

export interface Day extends Common {
    date?: string;
}

export interface Booking {
    userId: string | null;
    fieldId: string;
    isLongTermBooking: boolean;
    totalPrice: number;
    bookingDetails: BookingDetail[];
  }
  
  export interface BookingDetail {
    dayId: string;
    slots: string[];
    bookingDate: string;
  }

  export interface DialogTable {
    timeSlot: string;
    date: string;
    day: string;
    rate: number;
  }

  export interface SelectableSlot {
    dayGuid: string;
    slotGuid: string;
    date: string;
    rate: number;
  }
  
  export class FieldDetail {
    guid: string;
    fieldName: string;
    address: string;
    area?: number;
    phoneNumber?: string;
    isAvailable: boolean;
    rulesPolicies?: string;
    description?: string;
    isActive: boolean;
    closeDays: string[]; 
    documents: { fileName: string; fileType?: string; document?: string; description?: string }[];
  }

export const FIELD_COLUMNS: ColumnField<FieldsDetailList>[] = [
    { key: 'fieldName', label: 'Field Name', icon: 'sports_soccer', labelType: 'title', isVisible: true },
    { key: 'isAvailable', label: 'Available', icon: 'check_circle', labelType: 'badge', isVisible: true },
    { key: 'description', label: 'Description', labelType: 'description', isVisible: true },
    { key: 'address', label: 'Address', icon: 'location_on', labelType: 'list', isVisible: true },
    { key: 'area', label: 'Area', icon: 'square_foot', labelType: 'list', isVisible: true },
    { key: 'phoneNumber', label: 'Phone', icon: 'phone', labelType: 'list', isVisible: true },
    { key: 'rulesPolicies', label: 'Rules & Policies', icon: 'gavel', labelType: 'list', isVisible: true }
];
