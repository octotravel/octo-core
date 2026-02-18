export interface BaseRequestMetaData {
  id: string;
  date: Date;
  duration: number;
  url: string;
  method: string;
  status: number;
  success: boolean;
}
