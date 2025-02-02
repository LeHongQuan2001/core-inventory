import {isPlatformBrowser} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {readFileSync} from 'fs';
import {join} from 'path';
import {Observable, of} from 'rxjs';
import {environment} from "../../../environments/environment";

const i18nMap = require('../../../assets/i18n/autogen/map.json');

export class TranslateBrowserLoader implements TranslateLoader {
    constructor(
        private transferState: TransferState,
        private http: HttpClient,
        private prefix: string = './assets/i18n/',
        private suffix: string = '.json',
    ) {
    }

    public getTranslation(lang: string): Observable<any> {
        const key = makeStateKey<any>('transfer-translate-' + lang);
        const data = this.transferState.get(key, null);

        const suffix = environment.production ? `.${i18nMap[lang]}${this.suffix}` : `${this.suffix}?v=` + (new Date).getTime();

        // First we are looking for the translations in transfer-state, if none found, http load as fallback
        return data
            ? of(data)
            : new TranslateHttpLoader(this.http, this.prefix, suffix).getTranslation(lang);
    }
}

export class TranslateFSLoader implements TranslateLoader {
    constructor(
        private transferState: TransferState,
        private prefix = './assets/i18n/',
        private suffix = '.json'
    ) {
    }

    /**
     * Gets the translations from the server, store them in the transfer state
     */
    public getTranslation(lang: string): Observable<any> {
        const path = join(__dirname, '../browser', this.prefix, `${lang}.${i18nMap[lang]}${this.suffix}`);
        const data = JSON.parse(readFileSync(path, 'utf8'));

        const key = makeStateKey<any>('transfer-translate-' + lang);
        this.transferState.set(key, data);

        return of(data);
    }
}

export function translateLoaderFactory(httpClient: HttpClient, transferState: TransferState, platform: any) {
    const prefix = environment.production ? './assets/i18n/autogen/' : './assets/i18n/';
    return isPlatformBrowser(platform)
        ? new TranslateBrowserLoader(transferState, httpClient, prefix)
        : new TranslateFSLoader(transferState, prefix);
}
