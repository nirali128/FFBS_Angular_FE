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
    averageRating: number;
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
    isDirectBooking: boolean;
    bookingDetails: BookingDetail[];
  }
  
  export interface BookingDetail {
    dayId?: string;
    slots: string[];
    bookingDate: string;
  }

  export interface DialogTable {
    timeSlot: string;
    date: string;
    day?: string;
    rate: number;
  }

  export interface SelectableSlot {
    dayGuid?: string;
    slotGuid: string;
    date: string;
    rate: number;
    availability?: boolean 
  }
  
  export class FieldDetail {
    guid: string;
    fieldName: string;
    address: string;
    area?: number;
    phoneNumber?: string;
    baseRate: number;
    isAvailable: boolean;
    rulesPolicies?: string;
    description?: string;
    isActive: boolean;
    closeDays: string[]; 
    documents: FieldDocument[];
    averageRating: number;
  }

  export class FieldDocument {
    fileName: string; 
    fileType?: string; 
    document?: string; 
    description?: string 
  }

  export class FieldSlotRateRequestData {
    fieldId: string;
    date: string[];
  }

  export class FieldSlotRateData {
    date: string;
    slots: NewSlot[]
  }

  export class NewSlot {
    slotId: string;
    startTime: string;
    endTime: string;
    rate?: number;
    availability?: boolean;
    status?: string; 
  }

  export interface CalendarSlot {
    slotId: string;
    startTime: string;
    endTime: string;
    status?: string;
  }

  export interface BookingDetailsResponseDto {
    bookingId: string;
    totalPrice: number;
    isLongTermBooking?: boolean;
    fieldId: string;
    fieldName: string;
    address: string;
    status?: string;
    combinedBookingDate?: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
    };
    bookingDetails?: {
      bookingDate: string;
      dayName: string;
      slots: {
        slotId: string;
        startTime?: string;
        endTime?: string;
        description: string;
      }[];
    }[];
  }
  
  export interface BookingTableData {
    bookingId: string;
    fieldName: string;
    totalPrice: number;
    bookingDate: string;
    dayName: string;
    username: string;
    status?: string;
  }

  export interface BookingApproveReject {
    bookingId: string;
    status: string;
  }

  export interface FieldSlotAddRateAvailabilityRequestData {
    fieldId: string;
    rateType: string;
    dates: FieldSlotDate[];
  }
  
  export interface FieldSlotDate {
    date: string;
    dayId: string;
    slots: SlotDetail[];
  }
  
  export interface SlotDetail {
    slotId: string;
    oldRate?: number;
    adjustedRate?: number; 
    isAvailable?: boolean
  }

export const FIELD_COLUMNS: ColumnField<FieldsDetailList>[] = [
    { key: 'documentName', label: 'Image', labelType: 'image', isVisible: true },
    { key: 'fieldName', label: 'Field Name', icon: 'sports_soccer', labelType: 'title', isVisible: true },
    { key: 'isAvailable', label: 'Available', icon: 'check_circle', labelType: 'badge', isVisible: true },
    { key: 'description', label: 'Description', labelType: 'description', isVisible: true },
    { key: 'address', label: 'Address', icon: 'location_on', labelType: 'list', isVisible: true },
    { key: 'area', label: 'Area', icon: 'square_foot', labelType: 'list', isVisible: true },
    { key: 'phoneNumber', label: 'Phone', icon: 'phone', labelType: 'list', isVisible: true },
    { key: 'rulesPolicies', label: 'Rules & Policies', icon: 'gavel', labelType: 'list', isVisible: true },
    { key: 'averageRating', label: 'Rating', labelType: 'rating', isVisible: true }
];
