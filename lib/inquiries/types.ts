export type InquiryStatus = "new" | "in_review" | "responded" | "closed";
export type InquiryType = "project" | "general" | "partnership" | "careers";

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  inquiryType: InquiryType | string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  currentProduct?: string;
  message: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
  status: InquiryStatus;
  adminNotes?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitInquiryInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  inquiryType: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  currentProduct?: string;
  message: string;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentSize?: number;
}
