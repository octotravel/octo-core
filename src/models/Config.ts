export enum Environment {
  PRODUCTION = 'production',
  STAGING = 'staging',
  TEST = 'test',
  LOCAL = 'local',
}

export class BaseConfig {
  public environment: Environment;
  public isProduction: boolean;
  public isTest: boolean;
  public isLocal: boolean;
  public isStaging: boolean;
  public productionURL: string;
  public stagingURL: string;
  public alertWebhookURL: string;

  public constructor({
    environment,
    productionURL,
    stagingURL,
    alertWebhookURL,
  }: {
    environment: Environment;
    productionURL: string;
    stagingURL: string;
    alertWebhookURL: string;
  }) {
    this.environment = environment;
    this.isProduction = environment === Environment.PRODUCTION;
    this.isTest = environment === Environment.TEST;
    this.isLocal = environment === Environment.LOCAL;
    this.isStaging = environment === Environment.STAGING;
    this.productionURL = productionURL;
    this.stagingURL = stagingURL;
    this.alertWebhookURL = alertWebhookURL;
  }

  public getURL = (): string => {
    if (this.isProduction) {
      return this.productionURL;
    }
    if (this.isStaging) {
      return this.stagingURL;
    }
    return this.productionURL;
  };
}
