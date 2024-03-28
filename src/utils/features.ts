import { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { MessageResponse } from '../types/api-types';
import { SerializedError } from '@reduxjs/toolkit';
import { NavigateFunction, RelativeRoutingType } from 'react-router-dom';
import toast from 'react-hot-toast';
import moment from 'moment';

type ResType =
  | {
      data: MessageResponse;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
    };

interface ResponseToastType {
  res: ResType;
  navigate: NavigateFunction | null;
  url: string;
  relative?: RelativeRoutingType;
}

export const responseToast = ({
  res,
  navigate,
  url,
  relative = 'route'
}: ResponseToastType) => {
  if ('data' in res) {
    toast.success(res.data.message);
    if (navigate) navigate(url, { relative });
  } else {
    const error = res.error as FetchBaseQueryError;
    const { message: messageResponse } = error.data as MessageResponse;
    toast.error(messageResponse);
  }
};

export const getLastMonths = () => {
  const currentDate = moment();
  currentDate.date(1);

  const last6Months: string[] = [];
  const last12Months: string[] = [];

  for (let i = 0; i < 6; i++) {
    const monthDate = currentDate.clone().subtract(i, 'months');
    const monthName = monthDate.format('MMMM');
    last6Months.unshift(monthName);
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = currentDate.clone().subtract(i, 'months');
    const monthName = monthDate.format('MMMM');
    last12Months.unshift(monthName);
  }

  return {
    last12Months,
    last6Months
  };
};
