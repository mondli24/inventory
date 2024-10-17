import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerPage } from './manager.page';

const routes: Routes = [
  {
    path: 'manager',
    component: ManagerPage,
    children:[
      {
        path: 'view-inventory',
        loadChildren: () => import('../pages/view-inventory/view-inventory.module').then( m => m.ViewInventoryPageModule)
      },
      {
        path: 'add-inventory',
        loadChildren: () => import('../pages/add-inventory/add-inventory.module').then( m => m.AddInventoryPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'update-inventory',
        loadChildren: () => import('../pages/update-inventory/update-inventory.module').then( m => m.UpdateInventoryPageModule)
      },
      {
        path: 'analytics',
        loadChildren: () => import('../pages/analytics/analytics.module').then( m => m.AnalyticsPageModule)
      },
      {
        path: 'view-all-slips',
        loadChildren: () => import('../pages/view-all-slips/view-all-slips.module').then( m => m.ViewAllSlipsPageModule)
      }
      

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerPageRoutingModule {}
