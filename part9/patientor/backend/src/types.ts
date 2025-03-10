export type Gender = "male" | "female" | "other";

export interface PatientEntry {
  id: number;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
