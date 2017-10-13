## 项目初始化
```bash
# 初始化项目，跳过自动安装依赖，指定样式文件为scss
ng new basic-code -si -style=scss
cd basic-code
cnpm i
```

## 创建CoreModule
CoreModule用来导入那些初始化页面就需要导入一次的模块和组件。  
模块用imports装饰，组件需要exports和declarations。  
根模块只需imports核心模块即可。 

## 创建模块并配置对应路由

1. 创建根路由模块  
```js
/* app-routing.module.ts */
/* 该模块应该由CoreModule来导入、导出 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'project', redirectTo: '/project', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

2. 创建对应模块的路由  
```js
/* login/login-routing.module.ts */
/* 这个模块要被Login.module.ts导入 */
/* 最后这个LoginModule要被CoreModule导入 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
```
3. 在Login.module.ts文件中导入`LoginRoutingModule`  
4. LoginModule中的组件要被Login.module.ts装饰  
5. 在app.module.ts中导入导出`LoginModule`（有业务的模块在app.module.ts中导入）  

## SharedModule
SharedModule用来导入导出共享模块。  
SharedModule用来导出和装饰全局共享组件。  

```js
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentComponent } from './shared-component/shared-component.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    // 导出CommonModule后，其他模块就只需导入SharedModule即可
    CommonModule,
    // 全局共享的组件
    SharedComponentComponent,
  ],
  declarations: [
    SharedComponentComponent,
  ],
  entryComponents: [
    // 一些如对话框之类的弹出型组件需要从一开始就预加载好，这样的组件除了要导出和装饰，还需要在这里占位
  ],
})
export class SharedModule { }
```

## redux你的angular
很认同一句话，rxJs与ngrx是angular的倚天剑与屠龙刀。下面唠一唠怎么使用屠龙刀。  
准备工作先做好：
```bash
cnpm install @ngrx/store --save
cnpm install @ngrx/store-devtools --save
cnpm install @ngrx/effects --save
cnpm install @ngrx/router-store --save
cnpm i --save ngrx-store-freeze
```  

### 基本使用
1. 创建目录结构  
---|ngrx  
--------|actions  
------------|test.action.ts  
--------|reducers  
------------|test.reducer.ts  
--------|index.ts （ngrx模块，整合reducer）    
2. action定义  
3. 分reducer定义
```js
import * as testActions from '../actions/test.action';

// 分State类型
export interface State {
  counter: number
};

// 初始化分state
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
```  
4. ngrx模块定义  
```js
import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer, compose } from '@ngrx/store';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// fromTest包含initialState、reducer
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
```  
5. 将ngrx模块引入CoreModule中（代码省略）  
6. 呈现state中的数据  
```js
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { INCREMENT } from '../../ngrx/actions/test.action';
import * as fromRoot from '../../ngrx';

// ...
counter: Observable<number>;

// 注入store（得到的是一个流，请注意）
constructor(private store: Store<fromRoot.State>) {
  this.counter = store.select(state => state.test.counter)
}

// 派发动作
increment(){
  this.store.dispatch({ type: INCREMENT });
}
```  

```html
<div (click)="increment()">Current Count: {{ counter | async }}</div>
```

### 开发环境中自动打印日志
1. 定义logger函数  
```js
function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}
```
2. 根据环境插入中间件  
```js
const metaReducers: MetaReducer<State>[] = !environment.production
? [logger] // 更多中间件往数组里面加元素即可
: [];
```  
3. 引入reducer  
```js
imports: [
  // ...
  StoreModule.forRoot(reducers, { metaReducers }),
]
```

### 给action添加类型限制
1. actions重定义,type类型基本为string，我们需要确定的是payload的类型    
```js
import { Action } from '@ngrx/store';

export const INCREMENT  = '[Counter] Increment';
export const DECREMENT  = '[Counter] Decrement';
export const RESET      = '[Counter] Reset';

export class Increment implements Action {
  readonly type = INCREMENT;
}

export class Decrement implements Action {
  readonly type = DECREMENT;
}

export class Reset implements Action {
  readonly type = RESET;

  // payload被限定为number类型
  constructor(public payload: number) {}
}

// 导出type类
export type All
  = Increment
  | Decrement
  | Reset;
```

2. reducer中使用强类型action  
```js
import * as testActions from '../actions/test.action';

export type Action = testActions.All;
// ...
export function reducer(state: number = 0, action: Action): State {
  switch(action.type) {
    // ...
    case CounterActions.RESET: {
      return action.payload; // typed to number
    }    

    default: {
      return state;
    }
  }
}
```

### effects
1. 创建effects文件夹，并且在内部创建effects模块文件以及各个分effects模块  
2. 创建分effects  
```js
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';

import * as testActions from '../actions/test.action';

export type Action = testActions.All;

@Injectable()
export class TestEffects {
  @Effect() 
  // 接管testActions.INCREMENT动作
  increment$ = this.actions$.ofType(testActions.INCREMENT)
    .mergeMap(action => Observable.interval(1000))
    .mapTo({type: testActions.DECREMENT}) // 派发你真正需要派发的动作
    
  constructor(
    private actions$: Actions
  ) {}      
}
```  
3. 创建effects模块  
```js
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { TestEffects } from './test.effect';

@NgModule({
  imports: [ 
    EffectsModule.forRoot([TestEffects]),
  ]
})
export class AppEffectsModule {}
```  
4. 在ngrx总模块中导入effects模块  
```js
import { AppEffectsModule } from './effects/index';
// ...
imports: [
  // 最好在reducer被导入之后
  AppEffectsModule,
]
```







