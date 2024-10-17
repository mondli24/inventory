import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewSlipPageRoutingModule } from './view-slip-routing.module';

import { ViewSlipPage } from './view-slip.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewSlipPageRoutingModule
  ],
  declarations: [ViewSlipPage]
})
export class ViewSlipPageModule {}
