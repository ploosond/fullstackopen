import patients from "../../data/patients";
import { NewPatientEntry, Patient, PatientEntriesWithoutSSN } from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): PatientEntriesWithoutSSN => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
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

export default {
  getPatients,
  addPatient,
  findById,
};
