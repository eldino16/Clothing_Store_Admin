import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../interfaces/menu.interface';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  userImage: string = 'assets/images/user.png';
  logoImage: string = 'assets/images/DinoMallLogo.png';
  fullName: string = '';
  emailId: string = '';
  menuItems: Menu[] = [];

  constructor(private _menuService: MenuService) {}

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem('userDetails'));
    this.fullName = `${userDetails.firstName} ${userDetails.lastName}`;
    this.emailId = `${userDetails.email}`;
    this.userImage =
      userDetails.imagePath == '' || userDetails.imagePath == null
        ? 'assets/images/user.png'
        : environment.BASE_IMAGE_PATH + userDetails.imagePath;
    this.menuItems = this._menuService.MENU_ITEMS;
  }

  toggleMenu(menuItem: Menu) {
    menuItem.active = !menuItem.active;
  }
}
