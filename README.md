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



