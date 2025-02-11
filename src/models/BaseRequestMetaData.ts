import { UTCDate } from '@date-fns/utc';
export interface BaseRequestMetaData {
  id: string;
  date: UTCDate;
  url: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
}
