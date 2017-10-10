import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { INCREMENT } from '../../ngrx/actions/test.action';
import * as fromRoot from '../../ngrx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  counter: Observable<number>;

  constructor(private store: Store<fromRoot.State>) {
    this.counter = store.select(state => state.test.counter)
	}

  ngOnInit() {
    this.counter.subscribe(v => console.log(v))
    console.log(this.counter)
  }

  increment(){
    this.store.dispatch({ type: INCREMENT });
	}
}
