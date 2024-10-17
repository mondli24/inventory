import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllSlipsPage } from './view-all-slips.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllSlipsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllSlipsPageRoutingModule {}
