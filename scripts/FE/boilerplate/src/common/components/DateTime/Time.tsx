import React from 'react';
import { dateFormatter } from 'common/helpers/date.helper';

interface IComponentProps {
  className?: string;
  dateTime: string;
  format?: string;
}

export const Time: React.FC<IComponentProps> = props => {
  const { className, dateTime, format } = props;

  return <time className={className} dateTime={dateTime} children={dateFormatter(dateTime, format)} />;
};
