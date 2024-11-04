import { Provider, APP_INITIALIZER, isDevMode } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {VCCORP_WEB_PUSH_SETTINGS_TOKEN} from "../tokens/vccorp-web-push-settings-token";
import {IVccorpWebPushSettings} from "../interfaces/i-vccorp-web-push-settings";

/**
 * Provide a DI Configuration to attach GA Initialization at Angular Startup Cycle.
 */
export const VCCORP_WEB_PUSH_INITIALIZER_PROVIDER: Provider = {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: VccorpWebPushInitializer,
    deps: [
        VCCORP_WEB_PUSH_SETTINGS_TOKEN,
        DOCUMENT
    ]
};

/**
 * Create a script element on DOM and link it to Google Analytics tracking code URI.
 * After that, execute exactly same init process as tracking snippet code.
 */
export function VccorpWebPushInitializer(
    settings: IVccorpWebPushSettings,
    document: Document
) {
    return async () => {
        // if (!settings.appId) {
        //     if (!isDevMode()) {
        //         console.error('Empty embedded code for VCCorp Web Push. Make sure to provide one when initializing Vccorp Web Push Module.');
        //     }
        //     return;
        // }

        if (!document) {
            if (!isDevMode()) {
                console.error('Was not possible to access Document interface. Make sure this module is running on a Browser w/ access do Document interface.');
            }
        }

        // Set default ga.js uri
        settings.uri = settings.uri || `https://static.contineljs.com/not/apps/${settings.appId}.js`;

        const s: HTMLScriptElement = document.createElement('script');
        s.async = true;
        s.src = settings.uri;

        const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    };
}
