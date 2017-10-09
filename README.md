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

## material design
如何使用material组件，并且自定义主题以及切换主题？

### angualr与material结合
1. 安装Angular Material and Angular CDK  
```bash
npm install --save @angular/material @angular/cdk
```
2. 安装动画模块（貌似这个模块已经有了），并且导入动画模块  
```bash
npm install --save @angular/animations
```

```js
/* CoreModule中 */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ...
imports: [
  // ...
  // 动画模块一般放在所有模块最后，否则可能出现一些异常
  BrowserAnimationsModule,
],
```
3. 导入组件对应的模块  
```js
/* SharedModule中 */  
// vsCode中好像没有了自动导入material模块的功能
import { MatButtonModule } from '@angular/material';

// ...
imports: [
  MatButtonModule,
],
exports: [
  MatButtonModule,
],
```
4. 在任何组件内都可以使用已导入的material组件。 

### 更多配置
1. 设定主题  
```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
```
2. 移动端组件拖动支持  
```bash
npm install --save hammerjs
```  
```js
import 'hammerjs';
```
3. 图标支持  
```html
<!-- index.html中（官方图标库被墙，所以用360镜像来代替） -->

<link rel="stylesheet" href="//lib.baomitu.com/material-design-icons/3.0.0/iconfont/material-icons.min.css">
```  
4. 导入自带主题  
```scss
/* style.scss中 */
@import '~@angular/material/prebuilt-themes/deeppurple-amber.css';
```

### 自定义主题  
1. 创建自定义主题文件  
```scss
/* theme.scss */
@import '~@angular/material/theming';
@include mat-core();

$candy-app-primary: mat-palette($mat-indigo);
$candy-app-accent:  mat-palette($mat-pink, A200, A100, A400);
$candy-app-theme:   mat-light-theme($candy-app-primary, $candy-app-accent);

@include angular-material-theme($candy-app-theme);

// 黑夜模式
$dark-primary: mat-palette($mat-blue-grey);
$dark-accent:  mat-palette($mat-amber, A200, A100, A400);
$dark-warn:    mat-palette($mat-deep-orange);
$dark-theme:   mat-dark-theme($dark-primary, $dark-accent, $dark-warn);

.unicorn-dark-theme {
  @include angular-material-theme($dark-theme);
}
```  
2. 导入自定义主题  
```scss
/* style.scss中 */
@import 'theme.scss';
```  
3. 切换主题
```html
<!-- app.component.html中 -->
<!-- 这个div是整个应用的容器 -->
<div [class.unicorn-dark-theme]="darkTheme"></div>
```
4. 主题覆盖至弹出层  
```js
import { OverlayContainer } from '@angular/material';

// ...
constructor(private oc: OverlayContainer) {}

switchTheme(dark) {
  this.darkTheme = dark;
  this.oc.themeClass = dark ? 'unicorn-dark-theme' : null;
}
```