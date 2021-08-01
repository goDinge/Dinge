const convertAMPM = (time: Date) => {
  let displayTime: string;
  const hourSliced = new Date(time).toTimeString().slice(0, 2);
  const minutesSliced = new Date(time).toTimeString().slice(2, 5);
  if (Number(hourSliced) > 12) {
    displayTime = Number(hourSliced) - 12 + minutesSliced + 'PM';
  } else {
    displayTime = Number(hourSliced) - 0 + minutesSliced + 'AM';
  }
  return displayTime;
};

interface convertedType {
  [index: string]: string;
}

const convertFullWeekDayNames = (day: string) => {
  const converted: convertedType = {
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

const properDate = (date: Date) => {
  let displayDate: string;
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
