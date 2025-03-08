import express from "express";
import { calculateExercises, Arguments } from "./exerciseCalculator";
import { calculateBmi } from "./bmiCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack");
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target }: Arguments = req.body as Arguments;

  if (!daily_exercises || !target) {
    res.status(400).send({ error: "parameters missing" });
  }

  if (isNaN(target) || daily_exercises.some((n) => isNaN(n))) {
    res.status(400).send({ error: "malformatted parameters" });
  }

  try {
    const result = calculateExercises(daily_exercises, target);
    res.send({ result });
  } catch (error: unknown) {
    let errorMessage = "Something bad happened.";
    if (error instanceof Error) {
      errorMessage += "Error: " + error.message;
    }
    console.log(errorMessage);
  }
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!isNaN(height) && !isNaN(weight)) {
    const result = calculateBmi(height, weight);
    res.json({ weight, height, bmi: result });
  } else {
    res.json({
      error: "malformatted parameters",
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
