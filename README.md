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

