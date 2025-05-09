export interface Arguments {
  daily_exercises: number[];
  target: number;
}

const parseInputs = (args: string[]): Arguments => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (
    !isNaN(Number(args[2])) &&
    args
      .slice(3)
      .map((n) => Number(n))
      .every((n) => !isNaN(n))
  ) {
    return {
      daily_exercises: args.slice(3).map((n) => Number(n)),
      target: Number(args[2]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  exercises: number[],
  target: number
): Result => {
  const totalHours = exercises.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  const periodLength = exercises.length;

  const trainingDays = exercises.filter((e) => e !== 0).length;

  const average = periodLength > 0 ? totalHours / periodLength : 0;

  const success = average >= target ? true : false;

  const rating = average >= target ? 3 : average >= target * 0.5 ? 2 : 1;

  const ratingDescription =
    rating === 3
      ? "awesome that's perfect result"
      : rating === 2
      ? "not too bad but could be better"
      : "that's poor result ";

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  const { daily_exercises, target } = parseInputs(process.argv);
  console.log(calculateExercises(daily_exercises, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += "Error: " + error.message;
  }
  console.log(errorMessage);
}
