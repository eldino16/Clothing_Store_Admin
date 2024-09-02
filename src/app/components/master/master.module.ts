import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from './master-routing.module';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { CategoryComponent } from './category/category.component';
import { ColorComponent } from './color/color.component';
import { SizeComponent } from './size/size.component';
import { TagComponent } from './tag/tag.component';
import { UsertypeComponent } from './usertype/usertype.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    BrandlogoComponent,
    CategoryComponent,
    ColorComponent,
    SizeComponent,
    TagComponent,
    UsertypeComponent,
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    NgxDatatableModule,
    AgGridModule
  ],
})
export class MasterModule { }
