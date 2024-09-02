import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { contentRoutes } from './shared/routes/content.routes';
import { authGuard } from './components/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: contentRoutes,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
