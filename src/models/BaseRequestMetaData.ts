export interface BaseRequestMetaData {
  id: string;
  date: Date;
  url: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
}
