import { Provider, APP_INITIALIZER, isDevMode } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {FACEBOOK_SETTINGS_TOKEN} from "../tokens/facebook-settings-token";
import {IFacebookSettings} from "../interfaces/i-facebook-settings";

/**
 * Provide a DI Configuration to attach GA Initialization at Angular Startup Cycle.
 */
export const FACEBOOK_INITIALIZER_PROVIDER: Provider = {
    provide: APP_INITIALIZER,
    multi: true,
    useFactory: FacebookInitializer,
    deps: [
        FACEBOOK_SETTINGS_TOKEN,
        DOCUMENT
    ]
};

declare const window: any;
declare const FB: any;

/**
 * Create a script element on DOM and link it to Google Analytics tracking code URI.
 * After that, execute exactly same init process as tracking snippet code.
 */
export function FacebookInitializer(
    settings: IFacebookSettings,
    document: Document
) {
    return () => new Promise<void>(resolve => {
        // wait for facebook sdk to initialize before starting the angular app
        window['fbAsyncInit'] = function () {
            FB.init({
                appId: settings.appId,
                cookie: true,
                xfbml: true,
                version: settings.version
            });

            // auto authenticate with the api if already logged in with facebook
            // @ts-ignore
            FB.getLoginStatus(({authResponse}) => {
                if (authResponse) {
                    // accountService.apiAuthenticate(authResponse.accessToken)
                    //     .subscribe()
                    //     .add(resolve);
                } else {
                    // FB.login((response: any) => {
                    //     // handle the response
                    // });
                    resolve();
                }
            });
        };

        // load facebook sdk script
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            // @ts-ignore
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            // @ts-ignore
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    });
}
