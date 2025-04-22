import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "../../types";
import patientService from "../../services/patients";

import { Box, Typography } from "@mui/material";
import { Female, Male } from "@mui/icons-material";

const PatientView = () => {
  const [patient, setPatient] = useState<Patient>();
  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      const patient = await patientService.getPatient(id as string);
      setPatient(patient);
    };

    void fetchPatient();
  }, [id]);

  return (
    <div>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" fontWeight="">
          {patient?.name}
          {patient?.gender === "male" && <Male sx={{ mx: 1 }} />}
          {patient?.gender === "female" && <Female sx={{ mx: 1 }} />}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1">ssn: {patient?.ssn} </Typography>
          <Typography variant="body1">
            occupation: {patient?.occupation}
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default PatientView;
