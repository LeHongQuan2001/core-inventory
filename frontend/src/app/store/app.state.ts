import { AUTH_STATE_NAME } from '../modules/auth/state/auht.selector';
import { SharedState } from './shared/shared.state';
import { SHARED_STATE_NAME } from './shared/shared.selector';
import { SharedReducer } from './shared/shared.reducer';
import { AuthReducer } from '../modules/auth/state/auth.reducer';
import { AuthState } from '../modules/auth/state/auth.state';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';

export interface AppState {
    [SHARED_STATE_NAME]: SharedState;
    [AUTH_STATE_NAME]: AuthState;
    router: RouterReducerState;
}

export const appReducer = {
    [SHARED_STATE_NAME]: SharedReducer,
    [AUTH_STATE_NAME]: AuthReducer,
    router: routerReducer,
};
