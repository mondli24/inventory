import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage } from './pages.page';

const routes: Routes = [
  {
    path: '',
    component: PagesPage
  },  {
    path: 'view-inventory',
    loadChildren: () => import('./view-inventory/view-inventory.module').then( m => m.ViewInventoryPageModule)
  },
  {
    path: 'add-inventory',
    loadChildren: () => import('./add-inventory/add-inventory.module').then( m => m.AddInventoryPageModule)
  },
  {
    path: 'update-inventory',
    loadChildren: () => import('./update-inventory/update-inventory.module').then( m => m.UpdateInventoryPageModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./analytics/analytics.module').then( m => m.AnalyticsPageModule)
  },
  {
    path: 'pick',
    loadChildren: () => import('./pick/pick.module').then( m => m.PickPageModule)
  },
  {
    path: 'view-slip',
    loadChildren: () => import('./view-slip/view-slip.module').then( m => m.ViewSlipPageModule)
  },
  {
    path: 'view-picked',
    loadChildren: () => import('./view-picked/view-picked.module').then( m => m.ViewPickedPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'view-all-slips',
    loadChildren: () => import('./view-all-slips/view-all-slips.module').then( m => m.ViewAllSlipsPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
