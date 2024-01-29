import { AlertType } from '../types/AlertType';

export class AlertData {
  public constructor(
    public readonly type: AlertType = AlertType.GENERAL,
    public readonly message: string = '',
  ) {}
}
