export interface DiscountList {
  id: string;
  name: string;
  discountType: string;
  discountValue: number;
  code?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  conditions?: {
    conditionType: string;
    conditionValue: string;
  }[];
  allowedUsers?: string[];
}