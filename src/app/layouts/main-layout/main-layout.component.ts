import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MainMenuModule } from '../../shared/components/main-menu/main-menu.module';
import {MatSidenavModule} from "@angular/material/sidenav";

@Component({
  standalone: true,
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
      MatSidenavModule,
    RouterModule,
    HeaderComponent,
    MainMenuModule,
  ],
})
export class MainLayoutComponent {}
