import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer, compose, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { storeFreeze } from 'ngrx-store-freeze';

import * as fromTest from './reducers/test.reducer';
import { environment } from '../../environments/environment';

export interface State {
  test: fromTest.State
};

const initialState: State = {
  test: fromTest.initialState
};

const reducers: ActionReducerMap<State> = {
  test: fromTest.reducer
}

// console.log all actions
function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

const metaReducers: MetaReducer<State>[] = !environment.production
? [logger]
: [];

@NgModule({
  imports: [
    // StoreModule.forRoot({ routerReducer: routerReducer }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    })
  ]
})
export class AppStoreModule {}