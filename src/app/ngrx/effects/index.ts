import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { TestEffects } from './test.effect';

@NgModule({
  imports: [ 
    EffectsModule.forRoot([TestEffects]),
  ]
})
export class AppEffectsModule {}