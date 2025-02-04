import { Routes } from '@angular/router';

export const contentRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../../components/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: 'invoice',
    loadChildren: () =>
      import('../../components/invoice/invoice.module').then(
        (m) => m.InvoiceModule
      ),
  },
  {
    path: 'master',
    loadChildren: () =>
      import('../../components/master/master.module').then(
        (m) => m.MasterModule
      ),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('../../components/products/products.module').then(
        (m) => m.ProductsModule
      ),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('../../components/reports/reports.module').then(
        (m) => m.ReportsModule
      ),
  },
  {
    path: 'sales',
    loadChildren: () =>
      import('../../components/sales/sales.module').then((m) => m.SalesModule),
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('../../components/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../../components/users/users.module').then((m) => m.UsersModule),
  },
];
