import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewSlipPage } from './view-slip.page';

const routes: Routes = [
  {
    path: '',
    component: ViewSlipPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewSlipPageRoutingModule {}
