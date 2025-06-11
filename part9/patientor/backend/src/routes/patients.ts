import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import patientsService from "../services/patientsService";
import toEntry, { NewPatientSchema } from "../utils";
import { NewPatientEntry, Patient } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientsService.getPatients());
});

router.get("/:id", (req, res) => {
  const patient = patientsService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const newDiaryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  newDiaryParser,
  (req: Request<unknown, unknown, NewPatientEntry>, res: Response<Patient>) => {
    const addedEntry = patientsService.addPatient(req.body);
    res.json(addedEntry);
  }
);

router.post("/:id/entries", (req, res) => {
  try {
    const id = req.params.id;
    const newEntry = toEntry(req.body);
    const patient = patientsService.addPatientEntry(id, newEntry);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).send({ Error: "patient not found" });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ Error: error.message });
    } else {
      res.status(400).send({ Error: "unknown error" });
    }
  }
});

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.use(errorMiddleware);

export default router;
