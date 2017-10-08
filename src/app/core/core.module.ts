import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Header、Footer、siderBar等全局不变的组件在core下创建并导入
import { HttpModule } from '@angular/http';
import { HeaderComponent } from './header/header.component';
// 导入共享模块
import { SharedModule } from '../shared/shared.module';

// 移动端需要的一些拖拽等操作
// import 'hammerjs';

// rxjs相关导入
/*import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/concat';*/

// 将路由模块从根模块移到coreModule中
import { AppRoutingModule } from '../app-routing.module';
// import { ServicesModule } from '../services/services.module';

// 大盘如ngrx模块
// import { AppStoreModule } from '../reducers/index';

@NgModule({
  imports: [
    HttpModule,
    SharedModule,
    AppRoutingModule,
    // ServicesModule.forRoot(),
    // AppStoreModule,
    // 动画模块一般放在所有模块最后，否则可能出现一些异常
    BrowserAnimationsModule,
  ],
  exports: [
    HeaderComponent,
    AppRoutingModule,
  ],
  declarations: [
    HeaderComponent,
  ],
  providers: [
    // 注册变量到依赖注入池子中，将来可以通过在构造函数中@Inject('BASE_CONFIG') private config
    {provide: 'BASE_CONFIG', useValue: {
        uri: 'http://localhost:3000'
    }}
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parent: CoreModule,) {
    if(parent) {
      throw new Error("CoreModule已存在，不能再次加载！");
    }
  }
}

