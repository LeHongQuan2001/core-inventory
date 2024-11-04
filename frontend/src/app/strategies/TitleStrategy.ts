import {Injectable} from "@angular/core";
import { Title } from "@angular/platform-browser";
import {RouterStateSnapshot, TitleStrategy } from "@angular/router";
import {environment} from "../../environments/environment";
import {TranslateService} from "@ngx-translate/core";

@Injectable({providedIn: 'root'})
export class TemplatePageTitleStrategy extends TitleStrategy {
    constructor(private readonly title: Title,
                private translate: TranslateService) {
        super();
    }

    override updateTitle(routerState: RouterStateSnapshot) {
        const title = this.buildTitle(routerState);
        if (title) {
            this.translate.get(title).subscribe((translatedTitle) => {
                this.title.setTitle(`${translatedTitle} - ${this.translate.instant('common.name')}`);
            })
        }
    }
}
