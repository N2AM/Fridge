import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmRoutingModule } from './confirm-routing.module';
import { ConfirmationComponent } from './confirmation/confirmation.component';
@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule,
    ConfirmRoutingModule,
    SharedModule
  ]
})
export class ConfirmModule { }
