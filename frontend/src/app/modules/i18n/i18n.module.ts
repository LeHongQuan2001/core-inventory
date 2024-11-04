import {isPlatformBrowser} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Inject, NgModule, Optional, PLATFORM_ID} from '@angular/core';
import {BrowserTransferStateModule, TransferState} from '@angular/platform-browser';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Request} from 'express';
import {TranslateCacheModule, TranslateCacheService, TranslateCacheSettings} from 'ngx-translate-cache';

import {translateLoaderFactory} from './translate-loaders';
import {environment} from "../../../environments/environment";

@NgModule({
    imports: [
        BrowserTransferStateModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: translateLoaderFactory,
                deps: [HttpClient, TransferState, PLATFORM_ID]
            }
        }),
        TranslateCacheModule.forRoot({
            cacheService: {
                provide: TranslateCacheService,
                useFactory: translateCacheFactory,
                deps: [TranslateService, TranslateCacheSettings]
            },
            //cacheName: 'lang', // default value is 'lang'.
            cacheMechanism: 'Cookie',
            cookieAttributes: 'Path=/; SameSite=Lax; Secure'
        })
    ],
    exports: [TranslateModule]
})
export class I18nModule {
    constructor(
        translate: TranslateService,
        translateCacheService: TranslateCacheService,
        @Optional() @Inject(REQUEST) private req: Request,
        @Inject(PLATFORM_ID) private platform: any
    ) {
        if (isPlatformBrowser(this.platform)) {
            translateCacheService.init();
        }

        translate.addLangs(['vi', 'en']);

        // const browserLang = isPlatformBrowser(this.platform)
        //     ? translateCacheService.getCachedLanguage() || translate.getBrowserLang()
        //     : this.getLangFromServerSideCookie() || 'vi';
        //
        // translate.use(browserLang.match(/vi|en/) ? browserLang : 'vi');
        
        const lang = localStorage.getItem(environment.appPrefix + "locale");
        translate.use(lang ?? 'en');
    }

    getLangFromServerSideCookie() {
        if (this.req) {
            return this.req && typeof this.req.cookies !== 'undefined' && typeof this.req.cookies.lang !== 'undefined' ? this.req.cookies.lang : null;
        }
    }
}

export function translateCacheFactory(translateService: TranslateService, translateCacheSettings: TranslateCacheSettings) {
    return new TranslateCacheService(translateService, translateCacheSettings);
}
