export const getTime = (date, time) => {
  const [day, month, year] = date.split(".");
  const result = new Date(year, month - 1, day, time, 0, 0);
  return result.toString();
};
