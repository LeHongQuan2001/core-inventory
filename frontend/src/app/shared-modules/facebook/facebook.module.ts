import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VCCORP_WEB_PUSH_SETTINGS_TOKEN} from "../vccorp-web-push/tokens/vccorp-web-push-settings-token";
import {IVccorpWebPushSettings} from "../vccorp-web-push/interfaces/i-vccorp-web-push-settings";
import {VCCORP_WEB_PUSH_INITIALIZER_PROVIDER} from "../vccorp-web-push/initializers/vccorp-web-push.initializer";
import {FACEBOOK_SETTINGS_TOKEN} from "./tokens/facebook-settings-token";
import {FACEBOOK_INITIALIZER_PROVIDER} from "./initializers/facebook.initializer";
import {IFacebookSettings} from "./interfaces/i-facebook-settings";


@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class FacebookModule {
    static forRoot(appId: string, version: string, uri: string = '', callback?: any): ModuleWithProviders<FacebookModule> {
        return {
            ngModule: FacebookModule,
            providers: [
                {
                    provide: FACEBOOK_SETTINGS_TOKEN,
                    useValue: {
                        appId,
                        version,
                        uri,
                        callback
                    } as IFacebookSettings
                },
                FACEBOOK_INITIALIZER_PROVIDER
            ]
        }
    }
}
