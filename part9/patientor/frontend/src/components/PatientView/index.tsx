import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Diagnosis,
  OccupationalHealthcareEntry,
  HealthCheckRating,
  HealthCheckEntry,
  Patient,
} from "../../types";
import patientService from "../../services/patients";
import diagnosesService from "../../services/diagnoses";
import { HospitalEntry, Entry } from "../../types";

import { Box, Card, List, ListItem, Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkIcon from "@mui/icons-material/Work";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Female, Male } from "@mui/icons-material";

const Hospital = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <Box sx={{ marginY: 1 }}>
      <Typography>
        <Typography>{`Discharge date: ${entry.discharge.date}`}</Typography>
        <List sx={{ listStyle: "disc", marginLeft: 3 }}>
          <ListItem sx={{ display: "list-item", padding: 0 }}>
            {entry.discharge.criteria}
          </ListItem>
        </List>
      </Typography>
    </Box>
  );
};

const OccupationalHealthcare = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <Box sx={{ marginY: 1 }}>
      <Typography>{`Employer : ${entry.employerName}`}</Typography>
      {entry.sickLeave ? (
        <Typography>{`Sick leave: ${entry.sickLeave.startDate} - ${entry.sickLeave.endDate}`}</Typography>
      ) : null}
    </Box>
  );
};

const HealthCheck = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <Box sx={{ marginY: 1 }}>
      <HealthRating entry={entry.healthCheckRating} />
    </Box>
  );
};

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryType = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <LocalHospitalIcon />;
    case "OccupationalHealthcare":
      return <WorkIcon />;
    case "HealthCheck":
      return <MedicalServicesIcon />;
    default:
      return assertNever(entry);
  }
};

const HealthRating = ({ entry }: { entry: HealthCheckRating }) => {
  switch (entry) {
    case 0:
      return <FavoriteIcon sx={{ color: "green" }} />;
    case 1:
      return <FavoriteIcon sx={{ color: "yellow" }} />;
    case 2:
      return <FavoriteIcon sx={{ color: "blue" }} />;
    case 3:
      return <FavoriteIcon sx={{ color: "red" }} />;
  }
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case "Hospital":
      return <Hospital entry={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcare entry={entry} />;
    case "HealthCheck":
      return <HealthCheck entry={entry} />;
    default:
      return assertNever(entry);
  }
};

const PatientView = () => {
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getPatient(id as string);
      setPatient(patient);
    };

    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAll();
      setDiagnoses(diagnoses);
    };

    void fetchPatient();
    void fetchDiagnoses();
  }, [id]);

  return (
    <div>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" component="h5" fontWeight="bold">
          {patient?.name}
          {patient?.gender === "male" && <Male sx={{ mx: 1 }} />}
          {patient?.gender === "female" && <Female sx={{ mx: 1 }} />}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1">ssn: {patient?.ssn}</Typography>
          <Typography variant="body1">
            occupation: {patient?.occupation}
          </Typography>
          <Typography variant="h6" sx={{ my: 1 }} fontWeight="bold">
            entries
          </Typography>
          {patient?.entries.map((entry) => (
            <Card sx={{ border: 1, marginY: 1, padding: 0.5 }} key={entry.id}>
              <Typography>
                {entry.date} <EntryType entry={entry} />
              </Typography>
              <Typography fontStyle="italic">{entry.description}</Typography>
              {entry.diagnosisCodes?.map((d, i) => (
                <Box key={i}>
                  <List sx={{ listStyle: "disc", marginLeft: 3 }} key={d}>
                    <ListItem sx={{ display: "list-item", padding: 0 }}>
                      {d +
                        " " +
                        diagnoses.find((element) => element.code === d)?.name}
                    </ListItem>
                  </List>
                </Box>
              ))}
              <EntryDetails entry={entry} />
              <Typography>{`diagnose by ${entry.specialist}`}</Typography>
            </Card>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default PatientView;
