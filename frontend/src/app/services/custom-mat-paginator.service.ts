import { Injectable, OnDestroy } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil} from 'rxjs/operators';

@Injectable()
export class CustomMatPaginatorService extends MatPaginatorIntl implements OnDestroy  {

    unsubscribe: Subject<void> = new Subject<void>();
    OF_LABEL = 'of';

    constructor(private translate: TranslateService) {
        super();

        this.translate.onLangChange
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(() => {
                this.getAndInitTranslations();
            });

        this.getAndInitTranslations();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    getAndInitTranslations() {
        this.translate
            .get([
                'common.paginator.itemsPerPageLabel',
                'common.paginator.nextPage',
                'common.paginator.previousPage',
                'common.paginator.firstPage',
                'common.paginator.lastPage',
                'common.paginator.ofLabel',
            ])
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(translation => {
                this.itemsPerPageLabel = translation['common.paginator.itemsPerPageLabel'];
                this.firstPageLabel = translation['common.paginator.firstPage'];
                this.lastPageLabel = translation['common.paginator.lastPage'];
                this.nextPageLabel = translation['common.paginator.nextPage'];
                this.previousPageLabel = translation['common.paginator.previousPage'];
                this.OF_LABEL = translation['common.paginator.ofLabel'];
                this.changes.next();
            });
    }

    override getRangeLabel = (
        page: number,
        pageSize: number,
        length: number,
    ) => {
        if (length === 0 || pageSize === 0) {
            return `0 ${this.OF_LABEL} ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex =
            startIndex < length
                ? Math.min(startIndex + pageSize, length)
                : startIndex + pageSize;
        return `${(startIndex + 1).toLocaleString('en-US')} - ${endIndex.toLocaleString('en-US')} ${
            this.OF_LABEL
        } ${length.toLocaleString('en-US')}`;
    };
}
