import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {registerIcons, RegistryIcon} from "../../utils/icon-registry";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  @Output() closeMenu = new EventEmitter();
  constructor(
      iconRegistry: MatIconRegistry,
      sanitizer: DomSanitizer
  ) {
    const menuIcons: RegistryIcon[] = [
      { name: 'home', src: 'assets/icons/menu-home.svg' },
      { name: 'categories', src: 'assets/icons/menu-categories.svg' },
      { name: 'services', src: 'assets/icons/menu-services.svg' },
      { name: 'combos', src: 'assets/icons/menu-combo.svg' },
      { name: 'orders', src: 'assets/icons/menu-orders.svg' },
      { name: 'tasks', src: 'assets/icons/menu-tasks.svg' },
      { name: 'review-service', src: 'assets/icons/menu-rv-service.svg' },
      { name: 'discounts', src: 'assets/icons/menu-discount.svg' },
      { name: 'feedbacks', src: 'assets/icons/menu-feedback.svg' },
      { name: 'messages', src: 'assets/icons/menu-message.svg' },
      { name: 'none', src: 'assets/icons/menu-none.svg' },
      { name: 'setting', src: 'assets/icons/menu-setting.svg' },
    ];

    const icons: RegistryIcon[] = [
      { name: 'calendar', src: 'assets/icons/calendar-outline.svg' },
      { name: 'calendar-2', src: 'assets/icons/calendar-2.svg' },
      { name: 'search', src: 'assets/icons/search-normal.svg' },
      { name: 'search-loupe', src: 'assets/icons/search-loupe.svg' },
      { name: 'search-normal', src: 'assets/icons/search-normal.svg' },
      { name: 'arrow-left', src: 'assets/icons/arrow-left.svg' },
      { name: 'arrow-down', src: 'assets/icons/arrow-down.svg' },
      { name: 'add', src: 'assets/icons/add.svg' },
      { name: 'edit', src: 'assets/icons/edit-2-black.svg' },
      { name: 'edit-light', src: 'assets/icons/edit-2.svg' },
      { name: 'close', src: 'assets/icons/close.svg' },
      { name: 'close-circle', src: 'assets/icons/close-circle.svg' },
      { name: 'download', src: 'assets/icons/import.svg' },
      { name: 'upload', src: 'assets/icons/export.svg' },
      { name: 'trash', src: 'assets/icons/trash.svg' },
      { name: 'trash-red', src: 'assets/icons/red-trash.svg' },
      { name: 'print', src: 'assets/icons/printer.svg' },
      { name: 'menu-burger', src: 'assets/icons/menu-burger.svg' },
      { name: 'refresh', src: 'assets/icons/refresh.svg' },
      { name: 'dollar-circle', src: 'assets/icons/dollar-circle.svg' },
      { name: 'external-link', src: 'assets/icons/external-link.svg' },
    ];
    registerIcons(iconRegistry, sanitizer, 'menu', menuIcons);
    registerIcons(iconRegistry, sanitizer, 'icon', icons);

  }

  ngOnInit(): void {
  }

}
