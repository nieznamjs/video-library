import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { LibraryModule } from '../features/library/library.module';
import { CoreRoutingModule } from './core-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LibraryModule,
    CoreRoutingModule,
  ],
  exports: [
    SharedModule,
    LibraryModule,
  ],
})
export class CoreModule { }
