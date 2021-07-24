const timeConverter = (dateISO: Date) => {
  const dateDing = new Date(dateISO); //dateISO is time of ding creation that got passed in
  const dateMilli = dateDing.getTime();
  const dateNow = Date.now();
  const timeSinceUpload = dateNow - dateMilli;
  const minutesSinceUpload = Math.ceil(timeSinceUpload / 1000 / 60);
  const hoursSinceUpload = Math.ceil(timeSinceUpload / 1000 / 60 / 60);

  if (minutesSinceUpload < 60) {
    return `${minutesSinceUpload}m`;
  } else {
    return `${hoursSinceUpload}h`;
  }
};

export { timeConverter };
