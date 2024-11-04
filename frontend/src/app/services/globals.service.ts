import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class GlobalsService {
    core: any = {
        actions:  [
            {
                id: 1,
                name: 'GET'
            },
            {
                id: 2,
                name: 'POST'
            },
            {
                id: 3,
                name: 'PUT'
            },
            {
                id: 4,
                name: 'DELETE'
            }
        ],
        modules: [
            {
                id: 'role',
                name: 'Role',
            },
            {
                id: 'user',
                name: 'User',
            },
            {
                id: 'permission',
                name: 'Permission',
            },
            {
                id: 'route',
                name: 'Route',
            }
        ]
    };
    user: any = {
        guideDoc: '',
        avatar: {
            default: './assets/styles/default/images/user-default.png'
        }
    };
    fontDefault: any = `"Inter",system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`
}
