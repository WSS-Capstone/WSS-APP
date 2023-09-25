import {Component, Inject, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";

@Component({
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatDialogModule, CommonModule],
  selector: 'app-pop-up-dialog',
  templateUrl: './pop-up-dialog.component.html',
  styleUrls: ['./pop-up-dialog.component.scss'],
})
export class PopUpDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }
}
