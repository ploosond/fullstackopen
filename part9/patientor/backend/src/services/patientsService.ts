import patients from "../../data/patients";
import {
  NewPatientEntry,
  Patient,
  PatientEntriesWithoutSSN,
  EntryWithoutId,
} from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): PatientEntriesWithoutSSN => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      entries,
    })
  );
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string) => {
  const entry = patients.find((p) => p.id === id);
  return entry;
};

const addPatientEntry = (
  id: string,
  entry: EntryWithoutId
): Patient | undefined => {
  const entryId = uuid();
  const newEntry = { ...entry, id: entryId };
  const patient = patients.find((p) => p.id === id);
  if (patient) {
    patient.entries.push(newEntry);
  }
  return patient;
};

export default {
  getPatients,
  addPatient,
  findById,
  addPatientEntry,
};
