import { Injectable } from '@angular/core';
import { Menu } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() {}
  MENU_ITEMS: Menu[] = [
    {
      title: 'Dashboard',
      path: 'dashboard/default',
      icon: 'home',
      type: 'link',
      active: true,
    },
    {
      title: 'Products',
      icon: 'box',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Manage',
          type: 'menu',
          active: false,
          children: [
            {
              title: 'Product List',
              type: 'link',
              path: 'products/manage/product-list',
            },
            {
              title: 'Add Product',
              type: 'link',
              path: 'products/manage/add-product',
            },
          ],
        },
      ],
    },
    {
      title: 'Sales',
      icon: 'dollar-sign',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Orders',
          type: 'link',
          path: 'sales/orders',
        },
        {
          title: 'Transactions',
          type: 'link',
          path: 'sales/transactions',
        },
      ],
    },
    {
      title: 'Master',
      icon: 'clipboard',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Brand Logo',
          type: 'link',
          path: 'master/brandlogo',
        },
        {
          title: 'Category',
          type: 'link',
          path: 'master/category',
        },
        {
          title: 'Color',
          type: 'link',
          path: 'master/color',
        },
        {
          title: 'Size',
          type: 'link',
          path: 'master/size',
        },
        {
          title: 'Tag',
          type: 'link',
          path: 'master/tag',
        },
        {
          title: 'User Type',
          type: 'link',
          path: 'master/usertype',
        },
      ],
    },
    {
      title: 'Users',
      icon: 'user-plus',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'User List',
          type: 'link',
          path: 'users/user-list',
        },
        {
          title: 'Add User',
          type: 'link',
          path: 'users/add-user',
        },
      ],
    },
    {
      title: 'Settings',
      icon: 'settings',
      type: 'menu',
      active: false,
      children: [
        {
          title: 'Profile',
          type: 'link',
          path: 'settings/profile',
        },
      ],
    },
    {
      title: 'Reports',
      icon: 'bar-chart',
      type: 'link',
      path: 'reports',
      active: false,
    },
    {
      title: 'Invoice',
      icon: 'archive',
      type: 'link',
      path: 'invoice',
      active: false,
    },
    {
      title: 'Logout',
      icon: 'log-out',
      type: 'link',
      path: 'auth/login',
      active: false,
    },
  ];
}
