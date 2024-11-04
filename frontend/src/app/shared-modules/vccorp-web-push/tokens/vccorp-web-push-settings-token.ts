import { InjectionToken } from '@angular/core';
import { IVccorpWebPushSettings } from "../interfaces/i-vccorp-web-push-settings";

/**
 * Provide a Injection Token to global settings.
 */
export const VCCORP_WEB_PUSH_SETTINGS_TOKEN = new InjectionToken<IVccorpWebPushSettings>('vccorp-web-push-settings', {
    factory: () => ({ appId: '', callback: false, enableTracing: false })
});
