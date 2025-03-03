interface Inputs {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): Inputs => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const calculateBmi = (height: number, weight: number) => {
  height /= 100;

  const result = weight / (height * height);

  if (result < 16.0) {
    console.log("Underweight (Severe thinness) ");
  } else if (result > 16.0 && result < 16.9) {
    console.log("Underweight (Moderate thinness)");
  } else if (result > 17.0 && result < 18.4) {
    console.log("Underweight (Mild thinness)");
  } else if (result > 18.5 && result < 24.9) {
    console.log("Normal range");
  } else if (result > 25.0 && result < 29.9) {
    console.log("Overweight");
  } else if (result > 30.0 && result < 34.9) {
    console.log("Obese (Class I)");
  } else if (result > 35.0 && result < 39.9) {
    console.log("Obese (Class II)");
  } else if (result >= 40.0) {
    console.log("Obese (Class III) ");
  }
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  calculateBmi(value1, value2);
} catch (error: unknown) {
  let errorMessage = "Something bad happened";
  if (error instanceof Error) {
    errorMessage += "Error: " + error.message;
  }
  console.log(errorMessage);
}
