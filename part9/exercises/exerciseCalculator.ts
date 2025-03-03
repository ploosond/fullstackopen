interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (exercises: number[], target: number): Result => {
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
