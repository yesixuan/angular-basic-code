import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import * as testActions from '../actions/test.action';

export type Action = testActions.All;

@Injectable()
export class TestEffects {
  @Effect() 
  increment$ = this.actions$.ofType(testActions.INCREMENT)
    .mergeMap(action => Observable.interval(1000))
    .mapTo({type: testActions.DECREMENT})
    // .do(action => {
    //   console.log(action);
    // })
    
  constructor(
    private actions$: Actions
  ) {}      
}