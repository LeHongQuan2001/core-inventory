import { PreloadingStrategy, Route } from '@angular/router';
import {of} from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';

export class CustomPreloadingStrategyService implements PreloadingStrategy {
    preloadedModules: string[] = [];

    preload(route: Route, load: () => Observable<any>): Observable<any> {
        if (route.data && route.data['preload']) {
            this.preloadedModules.push(<string>route.path);
            return load();
        } else {
            return of(null);
        }
    }
}
