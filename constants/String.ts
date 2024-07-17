const emailValidation = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return !emailRegex.test(email);
};

const dateFormat = (date: number | string) => {
  if (!date) {
    return "";
  }
  const dateConvert = new Date(date * 1000);
  const hours = dateConvert.getHours();
  const minutes = dateConvert.getMinutes();
  const day = dateConvert.getDate();
  const month = dateConvert.getMonth() + 1;
  const year = dateConvert.getFullYear();

  const timeComponent = `${hours % 12 === 0 ? 12 : hours % 12}:${
    minutes < 10 ? "0" : ""
  }${minutes}${hours < 12 ? "am" : "pm"}`;

  const dateComponent = `${day < 10 ? "0" : ""}${day}/${
    month < 10 ? "0" : ""
  }${month}/${year}`;

  return `${timeComponent}, ${dateComponent}`;
};

const getMonthYearString = (date) => {
  try {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${months[monthIndex]} ${year}`;
  } catch (e) {
    console.log(e);
  }
};

export { emailValidation, dateFormat, getMonthYearString };
