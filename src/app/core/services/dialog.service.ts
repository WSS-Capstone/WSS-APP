import { Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { PopUpDialogComponent } from '../../shared/dialogs/pop-up-dialog/pop-up-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(component: any, data?: any): MatDialogRef<any> {
    return this.dialog.open(component, {
      width: '600px',
      data,
    });
  }

  openPopUp<T>(embeddedComponent: ComponentType<T>, options?: MatDialogConfig) {
    const { data, ...config } = options || {};
    return this.dialog.open(PopUpDialogComponent, {
      autoFocus: false,
      height: '208px',
      width: '450px',
      panelClass: [''],
      disableClose: false,
      data: {
        embeddedComponent: embeddedComponent,
        ...(data || {}),
      },
      ...(config || {}),
    });
  }

  open<T, R>(
    component: ComponentType<T>,
    options?: MatDialogConfig,
  ): MatDialogRef<T, R> {
    return this.dialog.open(component, {
      ...options,
    });
  }

  closeAll(): void {
    this.dialog.closeAll();
  }

  closeById(dialogId: string): void {
    const dialogRef = this.dialog.getDialogById(dialogId);
    dialogRef?.close();
  }

  get openDialogs() {
    return this.dialog.openDialogs;
  }
}
