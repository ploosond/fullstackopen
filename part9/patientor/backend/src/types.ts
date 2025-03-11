import { z } from "zod";
import { NewEntrySchema } from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export type PatientEntriesWithoutSSN = Omit<Patient, "ssn">[];

export type NewPatientEntry = z.infer<typeof NewEntrySchema>;

export interface Patient extends NewPatientEntry {
  id: number;
}
