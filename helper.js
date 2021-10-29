const getAvailableSlot = (
  operatingHours,
  shift1,
  shift2 = shift1,
  shift3 = shift1
) => {
  //* Construct all available slots
  const { firstBooking, lastBooking } = operatingHours;
  const availability = {};

  if (!shift1.timeSlot) shift1.timeSlot = {};
  if (!shift2.timeSlot) shift2.timeSlot = {};
  if (!shift3.timeSlot) shift3.timeSlot = {};

  const getMax = (time) => {
    if (time <= 13) return shift1?.maxCapacity;
    else if (time <= 17) return shift3?.maxCapacity;
    else return shift2?.maxCapacity;
  };

  const getBooking = (time) => {
    if (time <= 13)
      return shift1?.timeSlot[time] ? shift1?.timeSlot[time]?.length : 0;
    else if (time <= 17)
      return shift3?.timeSlot[time] ? shift3?.timeSlot[time]?.length : 0;
    else return shift2?.timeSlot[time] ? shift2?.timeSlot[time]?.length : 0;
  };

  for (i = firstBooking; i < lastBooking; i++) {
    if (i < 12) {
      availability[`${i}AM`] = getMax(i) - getBooking(i);
    } else if (i === 12) availability[`1PM`] = getMax(i) - getBooking(i);
    else availability[`${i - 12}PM`] = getMax(i) - getBooking(i);
  }

  return availability;
};

const getShift = (timeSlot) => {
  if (timeSlot < 13) return "shift1";
  else if (timeSlot > 17) return "shift3";
  else return "shift2";
};

const getDate = (date) => {
  const [day, month, year] = date.split(".");
  const result = new Date(year, month - 1, day);
  return result;
};

const getShiftBooking = (centreBooking) => {
  if (!centreBooking[0]) return [];
  const { shift1, shift2, shift3 } = centreBooking[0];

  //* IN USER DB, FIND BY ID AND PUSH INTO ARRAY

  let result = [];
  if (shift1 !== undefined && shift1.timeSlot) {
    const keyArr = Object.keys(shift1.timeSlot);
    for (let i = 0; i < keyArr.length; i++) {
      result.push(...shift1.timeSlot[keyArr[i]]);
    }
  }
  if (shift2 !== undefined && shift2.timeSlot) {
    const keyArr = Object.keys(shift2.timeSlot);
    for (let i = 0; i < keyArr.length; i++) {
      result.push(...shift2.timeSlot[keyArr[i]]);
    }
  }
  if (shift3 !== undefined && shift3.timeSlot) {
    const keyArr = Object.keys(shift3.timeSlot);
    for (let i = 0; i < keyArr.length; i++) {
      result.push(...shift3.timeSlot[keyArr[i]]);
    }
  }
  return result;
};

module.exports = { getAvailableSlot, getShift, getDate, getShiftBooking };
