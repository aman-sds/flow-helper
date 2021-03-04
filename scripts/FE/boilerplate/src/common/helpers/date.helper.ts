import moment from 'moment';

export const dateFormatter = (date: string, dateFormat: string = 'DD MMMM YYYY, HH:mm') => moment(date).format(dateFormat);
export const dateFormatterToUTC = (date: string, dateFormat: string = 'DD MMM YYYY, HH:mm') =>
  moment.utc(date, dateFormat).format();
export const dateDifference = (firstDate: string, secondDate: string) => moment(firstDate).diff(secondDate);
