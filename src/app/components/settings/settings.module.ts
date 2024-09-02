import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
