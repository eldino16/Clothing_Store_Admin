import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsertypeComponent } from './usertype/usertype.component';
import { TagComponent } from './tag/tag.component';
import { SizeComponent } from './size/size.component';
import { ColorComponent } from './color/color.component';
import { CategoryComponent } from './category/category.component';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'brandlogo', component: BrandlogoComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'color', component: ColorComponent },
      { path: 'size', component: SizeComponent },
      { path: 'tag', component: TagComponent },
      { path: 'usertype', component: UsertypeComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterRoutingModule {}
