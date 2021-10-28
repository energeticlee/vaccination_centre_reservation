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

module.exports = { getAvailableSlot };
