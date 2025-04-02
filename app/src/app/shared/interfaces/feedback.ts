export interface AddFeedback {
  bookingId: string;
  feedbackText: string;
  rating: number;
}

export interface FeedbackList {
  feedbackId: string;
  rating: number;
  feedbackText: string;
  bookingId: string;
  bookingNumber: string;
  userName: string;
  fieldName: string;
}