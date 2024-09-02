import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CollapseService } from '../../services/collapse.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  userImage: string = 'assets/images/user.png';

  constructor(public _collapseService: CollapseService) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.userImage =
      userDetails.imagePath == '' || userDetails.imagePath == null
        ? 'assets/images/user.png'
        : environment.BASE_IMAGE_PATH + userDetails.imagePath;
  }

  collapseSidebar() {
    this._collapseService.openSideBar = !this._collapseService.openSideBar;
  }
}
