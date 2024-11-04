import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdministratorPaginationService {
    public dataPaginate = new Subject<object>();
    public dataRecords = new Subject<object>();
    public activePagination = new Subject<boolean>();

    public setDataPaginate(data: any) {
        this.dataPaginate.next(data);
    }

    public setDataRecords(data: any) {
        this.dataRecords.next(data);
    }

    public resetActivePagination(status: boolean) {
        this.activePagination.next(status);
    }
}
