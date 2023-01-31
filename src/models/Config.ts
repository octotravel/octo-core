export enum Environment {
  Production = 'production',
  Test = 'test',
  Development = 'development',
  Staging = 'staging',

}

export class BaseConfig {
  public environment: Environment;
  public isProduction: boolean
  public isTest: boolean
  public isDevelopment: boolean
  public isStaging: boolean
  public productionURL: string
  public stagingURL: string;

  constructor({
    environment,
    productionURL,
    stagingURL,
  }: {
    environment: Environment
    productionURL: string;
    stagingURL: string;
  }) {
    this.environment = environment;
    this.isProduction = environment === Environment.Production;
    this.isTest = environment === Environment.Test;
    this.isDevelopment = environment === Environment.Development;
    this.isStaging = environment === Environment.Staging;
    this.productionURL = productionURL
    this.stagingURL = stagingURL
  }

  public getURL = () => {
    if (this.isProduction) {
      return this.productionURL;
    }
    if (this.isStaging) {
      return this.stagingURL;
    }
    return this.productionURL;
  }
}
