interface IAnyType {
  [key: string]: any;
}
export function objectToQuery(obj: IAnyType): string {
  return obj && typeof obj === 'object'
    ? `?${Object.keys(obj)
        .map(k => {
          const val = obj[k];
          return Array.isArray(val)
            ? obj[k].map((item: any) => `${encodeURIComponent(k)}[]=${encodeURIComponent(item)}`).join('&')
            : `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`;
        })
        .join('&')}`
    : !obj
    ? ''
    : obj;
}
