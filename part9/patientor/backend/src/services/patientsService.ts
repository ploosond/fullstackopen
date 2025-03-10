import patients from "../../data/patients";
import { PatientEntriesWithoutSSN } from "../types";

const getPatients = (): PatientEntriesWithoutSSN => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = () => {
  return null;
};

export default {
  getPatients,
  addPatient,
};
