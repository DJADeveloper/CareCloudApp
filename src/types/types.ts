export interface Resident {
  id?: string;
  fullName: string;
  phone: string;
  address: string;
  //   gender?: "M" | "F" | "Other";
  dateOfBirth: Date;
  pcp: string;
  photo?: string; // Optional or undefined
  email?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactRelationship?: string;
  dncConsent?: boolean;
  healthConditions?: string;
}
