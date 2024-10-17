import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllSlipsPageRoutingModule } from './view-all-slips-routing.module';

import { ViewAllSlipsPage } from './view-all-slips.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllSlipsPageRoutingModule
  ],
  declarations: [ViewAllSlipsPage]
})
export class ViewAllSlipsPageModule {}
