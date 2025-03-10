import diagnoses from "../../data/diagnoses";

import { Diagnosis } from "../types";

const getEntries = (): Diagnosis[] => {
  return diagnoses;
};

const addDiagnoses = () => {
  return null;
};

export default {
  getEntries,
  addDiagnoses,
};
