import * as testActions from '../actions/test.action';

export interface State {
  counter: number
};

export const initialState: State = {
  counter: 666
};

export function reducer(state = initialState, action: {type: string, payload: any} ): State {
  switch (action.type) {
    case testActions.DECREMENT: {
      return {
        counter: state.counter - 1
      };
    }
    case testActions.INCREMENT: {
      return {
        counter: state.counter + 1
      };
    }
    default: {
      return state;
    }
  }
}