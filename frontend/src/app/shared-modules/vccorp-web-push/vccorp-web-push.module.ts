import { NgModule, ModuleWithProviders } from '@angular/core';
import { VCCORP_WEB_PUSH_INITIALIZER_PROVIDER } from "./initializers/vccorp-web-push.initializer";
import {VCCORP_WEB_PUSH_SETTINGS_TOKEN} from "./tokens/vccorp-web-push-settings-token";
import { IVccorpWebPushSettings } from "./interfaces/i-vccorp-web-push-settings";

@NgModule({
    imports: [],
    declarations: [],
    exports: []
})
export class VccorpWebPushModule {
    /**
     * You should provide a valid web push embedded code. This code will be provided to the entire application by
     * `VCCORP_WEB_PUSH_SETTINGS_TOKEN` token. You can inject this code in you components if you like by
     * use the following injection code `@Inject(VCCORP_WEB_PUSH_SETTINGS_TOKEN) gaConfig: IVccorpWebPushSettings`
     *
     * @param appId The App Id
     * @param uri When placed, it will change the default js URI to the provided one.
     * @param callback The callback function
     * @param enableTracing When true, trace tracking errors on production mode.
     */
    static forRoot(appId: string, uri?: string, callback?: any, enableTracing?: boolean): ModuleWithProviders<VccorpWebPushModule> {
        return {
            ngModule: VccorpWebPushModule,
            providers: [
                {
                    provide: VCCORP_WEB_PUSH_SETTINGS_TOKEN,
                    useValue: {
                        appId,
                        uri,
                        callback,
                        enableTracing
                    } as IVccorpWebPushSettings
                },
                VCCORP_WEB_PUSH_INITIALIZER_PROVIDER
            ]
        };
    }
}
