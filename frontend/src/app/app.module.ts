import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LayoutAuth} from './layouts/auth/auth.component';
import {LocalStorageService} from './services/local-storage.service';
import {AuthModule} from "./modules/auth/auth.module";
import {LayoutDefaultComponent} from './layouts/default/default.component';
import {LayoutPartialHeaderComponent} from './layouts/_partials/header/header.component';
import {LayoutPartialFooterComponent} from './layouts/_partials/footer/footer.component';
import {LayoutPartialSidebarComponent} from './layouts/_partials/sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EncryptRequestInterceptor } from './interceptors/encrypt.request.interceptor';
import { DecryptResponseInterceptor } from './interceptors/decrypt.response.interceptor';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LayoutErrorComponent } from './layouts/error/error.component';
import { BaseComponent } from './components/base/base.component';
import { SiteLoaderComponent } from './components/site-loader/site-loader.component';
import {SiteLoaderService} from "./services/site-loader.service";
import {I18nModule} from './modules/i18n/i18n.module';
import {StoreModule} from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {AuthEffects} from "./modules/auth/state/auth.effects";
import { environment } from 'src/environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomSerializer } from './store/router/custom-serializer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {SharedSiteLoaderComponent} from "./shared/components/site-loader/site-loader.component";
import { appReducer } from './store/app.state';
import {ErrorInterceptor} from "./interceptors/error.interceptor";
import {SharedAlertMessageComponent} from './shared/components/alert-message/alert-message.component';
import {CustomMatPaginatorService} from "./services/custom-mat-paginator.service";
import { MatPaginatorIntl } from '@angular/material/paginator';
import {RECAPTCHA_V3_SITE_KEY, ReCaptchaV3Service, RECAPTCHA_SETTINGS} from 'ng-recaptcha';
import { GoogleRecaptchaInterceptor } from './interceptors/google.recaptcha.interceptor';
import {SharedModule} from "./shared-modules/shared.module";
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import {LayoutLandingPageComponent} from './layouts/landing-page/landing-page.component';
import {ConfirmDialogComponent} from "./components/_dialogs/confirm.dialog/confirm.dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import { TitleStrategy } from '@angular/router';
import { TemplatePageTitleStrategy } from './strategies/TitleStrategy';
import {SiteLoaderInterceptor} from "./interceptors/site-loader.interceptor";
import {HighlightService} from "./services/highlight.service";
import {LayoutEmptyComponent} from './layouts/empty/empty.component';
import {CoreSettingsService} from "./modules/core/services/settings.service";

@NgModule({
    declarations: [
        AppComponent,
        // layouts
        LayoutAuth,
        LayoutDefaultComponent,
        LayoutErrorComponent,
        LayoutLandingPageComponent,
        LayoutEmptyComponent,
        LayoutPartialHeaderComponent,
        LayoutPartialFooterComponent,
        LayoutPartialSidebarComponent,
        // components
        BaseComponent,
        SiteLoaderComponent,
        ConfirmDialogComponent,
        // pages
        PageNotFoundComponent,
        BaseComponent,
        // Shared Components
        SharedSiteLoaderComponent,
        SharedAlertMessageComponent
    ],
    imports: [
        AuthModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        I18nModule,
        SharedModule,
        EffectsModule.forRoot([AuthEffects]),
        StoreModule.forRoot(appReducer),
        StoreDevtoolsModule.instrument({
            logOnly: environment.production,
        }),
        StoreRouterConnectingModule.forRoot({
            serializer: CustomSerializer,
        }),
        MatDialogModule
    ],
    providers: [
        SiteLoaderService,
        LocalStorageService,
        {provide: TitleStrategy, useClass: TemplatePageTitleStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: GoogleRecaptchaInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: SiteLoaderInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: EncryptRequestInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: DecryptResponseInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
        {provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.google.recaptchaV3.siteKey},
        {
            provide: RECAPTCHA_SETTINGS,
            useValue: {
                size: 'invisible',
                badge: 'bottomleft'
            }
        },
        ReCaptchaV3Service,
        {provide: MatPaginatorIntl, useClass: CustomMatPaginatorService},
        HighlightService,
        {
            provide: APP_INITIALIZER,
            useFactory: (settings: CoreSettingsService) => () => {
                return settings.get({})
            },
            deps: [CoreSettingsService],
            multi: true
        }
    ],
    exports: [
        LayoutPartialHeaderComponent,
        LayoutPartialSidebarComponent,
        LayoutPartialFooterComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
