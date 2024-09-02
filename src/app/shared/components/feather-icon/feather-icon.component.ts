import { AfterViewInit, Component, Input } from '@angular/core';
import * as feather from 'feather-icons';
@Component({
  selector: 'app-feather-icon',
  templateUrl: './feather-icon.component.html',
  styleUrls: ['./feather-icon.component.scss'],
})
export class FeatherIconComponent implements AfterViewInit {
  @Input('icon') featherIcon: any;

  ngAfterViewInit(): void {
    feather.replace();
  }
}
