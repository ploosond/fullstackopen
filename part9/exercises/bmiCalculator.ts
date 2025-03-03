const calculateBmi = (height: number, weight: number) => {
  height /= 100;

  const result = weight / (height * height);

  if (result < 16.0) {
    return "Underweight (Severe thinness) ";
  } else if (result > 16.0 && result < 16.9) {
    return "Underweight (Moderate thinness)";
  } else if (result > 17.0 && result < 18.4) {
    return "Underweight (Mild thinness)";
  } else if (result > 18.5 && result < 24.9) {
    return "Normal range";
  } else if (result > 25.0 && result < 29.9) {
    return "Overweight";
  } else if (result > 30.0 && result < 34.9) {
    return "Obese (Class I)";
  } else if (result > 35.0 && result < 39.9) {
    return "Obese (Class II)";
  } else if (result >= 40.0) {
    return "Obese (Class III) ";
  }
};

console.log(calculateBmi(180, 74));
