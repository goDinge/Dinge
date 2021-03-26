const getMonthName = (num) => {
  let numName;
  switch (num) {
    case 1:
      numName = 'January';
      break;
    case 2:
      numName = 'February';
      break;
    case 3:
      numName = 'March';
      break;
    case 4:
      numName = 'April';
      break;
    case 5:
      numName = 'May';
      break;
    case 6:
      numName = 'June';
      break;
    case 7:
      numName = 'July';
      break;
    case 8:
      numName = 'August';
      break;
    case 9:
      numName = 'September';
      break;
    case 10:
      numName = 'October';
      break;
    case 11:
      numName = 'November';
      break;
    case 12:
      numName = 'December';
      break;
  }
  return numName;
};

export default getMonthName;
