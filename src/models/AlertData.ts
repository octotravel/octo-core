export class AlertData {
  public constructor(
    public readonly type: string = 'GENERAL',
    public readonly message: string = '',
  ) {}
}
