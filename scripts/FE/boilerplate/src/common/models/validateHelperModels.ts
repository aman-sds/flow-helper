export interface IValidateHelperErrorData {
  error: {
    details: IValidateHelperErrorDataDetailsItem[];
    message: string;
  };
}

interface IValidateHelperErrorDataDetailsItem {
  dataPath: string;
  message: string;
  params?: {
    missingProperty: string;
  };
}

export interface IValidateHelperErrorReturnData {
  errors: {
    [key: string]: string[];
  };
  message: string;
  status: number;
}
