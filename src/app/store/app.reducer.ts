import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../Authentication/store/auth.reducer';
import * as fromStore from '../main/store/store/store.reducer';

export interface appState{
    authentication:fromAuth.state;
    store: fromStore.state
}

export const appReducer:ActionReducerMap<appState> = {
    authentication : fromAuth.authReducer,
    store : fromStore.storeReducer,
}