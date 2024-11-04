import { InjectionToken } from '@angular/core';
import { IFacebookSettings } from "../interfaces/i-facebook-settings";

/**
 * Provide a Injection Token to global settings.
 */
export const FACEBOOK_SETTINGS_TOKEN = new InjectionToken<IFacebookSettings>('facebook-settings', {
    factory: () => ({ appId: '', version: '', uri: '', callback: false })
});
