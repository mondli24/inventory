import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path:'',
    redirectTo:'landing',
    pathMatch:'full'


  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'add-inventory',
    loadChildren: () => import('./pages/add-inventory/add-inventory.module').then( m => m.AddInventoryPageModule)
  },
  {
    path: 'update-inventory',
    loadChildren: () => import('./pages/update-inventory/update-inventory.module').then( m => m.UpdateInventoryPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  },
 
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then( m => m.PagesPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./manager/manager.module').then( m => m.ManagerPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./picker/picker.module').then( m => m.PickerPageModule)
  },
  {
    path: 'deliver',
    loadChildren: () => import('./deliver/deliver.module').then( m => m.DeliverPageModule)
  },
  {
    path: 'view-inventory',
    loadChildren: () => import('./pages/view-inventory/view-inventory.module').then( m => m.ViewInventoryPageModule)
  },
  {
    path: 'add-inventory',
    loadChildren: () => import('./pages/add-inventory/add-inventory.module').then( m => m.AddInventoryPageModule)
  },
  {
    path: 'update-inventory',
    loadChildren: () => import('./pages/update-inventory/update-inventory.module').then( m => m.UpdateInventoryPageModule)
  },
  {
    path: 'analytics',
    loadChildren: () => import('./pages/analytics/analytics.module').then( m => m.AnalyticsPageModule)
  },
  {
    path: 'pick',
    loadChildren: () => import('./pages/pick/pick.module').then( m => m.PickPageModule)
  },
  {
    path: 'view-slip',
    loadChildren: () => import('./pages/view-slip/view-slip.module').then( m => m.ViewSlipPageModule)
  },
  {
    path: 'view-picked',
    loadChildren: () => import('./pages/view-picked/view-picked.module').then( m => m.ViewPickedPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
