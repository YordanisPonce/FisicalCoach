import { environment } from './environments/environment';

/**
 * PROVIDES STATIC CONSTANTS WITH THE GENERAL APP SETTINGS
 */
export class AppSettings {

  public static isProduction = environment.production;

  public static serviceUrl = environment.API_URL;
  public static images = environment.images;

}

