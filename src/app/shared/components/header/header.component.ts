import { Component, OnInit } from '@angular/core';
import {DestroyService} from "../../../core/services/destroy.service";
import {MatIconModule} from "@angular/material/icon";
import {NgOptimizedImage} from "@angular/common";

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [MatIconModule, NgOptimizedImage],
  providers: [DestroyService],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
