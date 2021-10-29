export const getTime = (date, time) => {
  const [day, month, year] = date.split(".");
  const updateTime = time.slice(0, time.length - 2);
  const result = new Date(year, month - 1, day, updateTime, 0, 0);
  return result.toString();
};
