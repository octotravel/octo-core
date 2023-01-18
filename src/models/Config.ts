// @ts-ignore
const ENVIRONMENT: string = globalThis.ENVIRONMENT;
// @ts-ignore
const SUPABASE_URL: string = globalThis.SUPABASE_URL;
// @ts-ignore
const SUPABASE_KEY: string = globalThis.SUPABASE_KEY;

export class Config {
  public environment = ENVIRONMENT;
  public isProduction = ENVIRONMENT === "production";
  public isTest = ENVIRONMENT === "test";
  public isDev = ENVIRONMENT === "dev";
  public isStaging = ENVIRONMENT === "staging";
  public cityconnectProductionUrl = "https://octo.ventrata.com";
  public cityconnectStagingUrl = "https://staging.cityconnect.net";
  public cityconnectUrl: string;
  public cityconnectRootUrl: string;
  public supabaseUrl = SUPABASE_URL;
  public supabaseKey = SUPABASE_KEY;

  constructor() {
    this.cityconnectUrl = this.getUrl();
    this.cityconnectRootUrl = `${this.cityconnectUrl}/octo`;
  }

  private getUrl = (): string => {
    return this.cityconnectProductionUrl;
  };
}
