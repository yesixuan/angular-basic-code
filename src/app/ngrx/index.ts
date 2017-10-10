import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer, compose } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromTest from './reducers/test.reducer';

export interface State {
  test: fromTest.State
};

const initialState: State = {
  test: fromTest.initialState
};

const reducers = {
  test: fromTest.reducer
}

const productionReducers: ActionReducer<State> = combineReducers(reducers)
// const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: {type: string, payload: any} ): State {
  return productionReducers(state, action)
}

@NgModule({
  imports: [
    // StoreModule.forRoot({ routerReducer: routerReducer }),
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    })
  ]
})
export class AppStoreModule {}