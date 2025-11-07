export const generateRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min)) + min;
};

export const generateRandomPosition = (max, size) => {
  const number = generateRandomNumber(0, max - size);
  return Math.round(number / size) * size;
};

export const generateRandomRGBColor = () => {
  const red = generateRandomNumber(0, 255);
  const green = generateRandomNumber(0, 255);
  const blue = generateRandomNumber(0, 255);

  return `rgb(${red}, ${green}, ${blue})`;
};