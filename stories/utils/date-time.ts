const splitDateStr = (dateStr: string) => {
  if (!dateStr) {
    return [];
  }

  return dateStr.split('/').map((part) => parseInt(part, 10));
};

export const getDayMonthYear = (dateStr: string) => {
  const today = new Date().toLocaleDateString('en-GB');
  const currentDate = dateStr || today;

  const [day, month, year] = splitDateStr(currentDate);
  const [defaultDay, defaultMonth, defaultYear] = splitDateStr(today);

  return {
    // eslint is suggesting we use Number.isNaN instead of isNaN but they have different behavior, so in our case we can to use isNaN
    // for more info https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#difference_between_number.isnan_and_global_isnan
    /* eslint-disable no-restricted-globals */
    day: isNaN(day) ? defaultDay : day,
    month: isNaN(month) ? defaultMonth : month,
    year: isNaN(year) ? defaultYear : year,
  };
};

export const createArrayDateData = ({ start, end }: { start: number; end: number }) => {
  const rangeArray: string[] = [];
  for (let i = start; i <= end; i++) {
    rangeArray.push(i.toString());
  }
  return rangeArray;
};

export const getYearsData = () => {
  const currentYear = new Date().getFullYear();
  return createArrayDateData({ start: currentYear - 130, end: currentYear });
};
