import { v4 as uuid } from "uuid";

export interface IDataGenerationService {
  generateUUID(): string;
}

export class DataGenerationService implements IDataGenerationService {
  public generateUUID = (): string => uuid();
}
