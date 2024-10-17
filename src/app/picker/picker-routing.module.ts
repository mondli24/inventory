import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickerPage } from './picker.page';

const routes: Routes = [
  {
    path: 'picker',
    component: PickerPage,
    children:[
      {
        path: 'view-inventory',
        loadChildren: () => import('../pages/view-inventory/view-inventory.module').then( m => m.ViewInventoryPageModule)
      },
      {
        path: 'pick',
        loadChildren: () => import('../pages/pick/pick.module').then( m => m.PickPageModule)
      },
      {
        path: 'view-picked',
        loadChildren: () => import('../pages/view-picked/view-picked.module').then( m => m.ViewPickedPageModule)
      },
      {
        path: 'view-slip',
        loadChildren: () => import('../pages/view-slip/view-slip.module').then( m => m.ViewSlipPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then( m => m.HomePageModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PickerPageRoutingModule {}
