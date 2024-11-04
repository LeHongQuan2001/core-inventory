import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {PaginatorComponent} from "../components/paginator/paginator.component";
import {MaterialModule} from "./material.module";
import {AutosizeModule} from "ngx-autosize";
import {SafeHtmlPipe} from "../pipes/safe-html.pipe";
import {ClipboardModule} from "@angular/cdk/clipboard";

@NgModule({
    declarations: [
        PaginatorComponent,
        SafeHtmlPipe
    ],
    imports: [
        CommonModule,
        AutosizeModule,
        TranslateModule,
        ClipboardModule,
        MaterialModule
    ],
    exports: [
        TranslateModule,
        AutosizeModule,
        SafeHtmlPipe,
        MaterialModule,
        ClipboardModule,
        PaginatorComponent
    ]
})
export class SharedModule {
}
