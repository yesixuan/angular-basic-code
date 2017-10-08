/**
 * 这个模块用来导入导出共享模块
 * 这个模块用来导出和装饰全局共享组件
 */
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
