const convertAMPM = (time) => {
  let displayTime;
  const hourSliced = new Date(time).toTimeString().slice(0, 2);
  const minutesSliced = new Date(time).toTimeString().slice(2, 5);
  if (hourSliced > 12) {
    displayTime = hourSliced - 12 + minutesSliced + 'PM';
  } else {
    displayTime = hourSliced - 0 + minutesSliced + 'AM';
  }
  return displayTime;
};

const convertFullWeekDayNames = (day) => {
  const converted = {
    Sun: 'Sunday',
    Mon: 'Monday',
    Tue: 'Tuesday',
    Wed: 'Wednesday',
    Thu: 'Thursday',
    Fri: 'Friday',
    Sat: 'Saturday',
  };
  return converted[day];
};

const properDate = (date) => {
  let displayDate;
  const weekDayShort = new Date(date).toDateString().slice(0, 3);
  const restOfDate = new Date(date).toDateString().slice(4);
  const dateArray = restOfDate.split(' ');
  dateArray.splice(1, 1, dateArray[1].concat(', '));
  const goodRestOfDate = dateArray.join(' ');
  const weekDayLong = convertFullWeekDayNames(weekDayShort);

  displayDate = weekDayLong + ',  ' + goodRestOfDate;
  return displayDate;
};

export { convertAMPM, convertFullWeekDayNames, properDate };
