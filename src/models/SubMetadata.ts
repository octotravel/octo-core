export interface SubMetadata {
  id: string;
  requestId: string;
  date: Date;
  url: string;
  method: string;
  status: number;
  success: boolean;
  duration: number;
}
