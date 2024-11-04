import {Injectable} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    
    constructor(public translate: TranslateService,) {
    }
    
    public getCountTime2Day() {
        const times = [];
        for (let i = 1; i <= 48; i++) {
            let value: any = i;
            value = value.toString();
            const time = {
                id: i,
                text: i + ' ' + this.translate.instant('modules.notify.notification.timeEffectTitle'),
            };
            times.push(time);
        }
        return times.reverse();
    }
}
