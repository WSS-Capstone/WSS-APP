import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from "@angular/common";
import {Store} from "@ngrx/store";
import {AuthState} from "../../../core/models/auth/auth-state";
import {deleteLoginError} from "../../../store/actions/auth.actions";

export type AlertMessageType = 'success' | 'warn' | 'danger' | 'info';

export enum AlertIconPaths {
  warn = './assets/icons/warning.svg',
  success = './assets/icons/success.svg',
  info = './assets/icons/info.svg',
  danger = './assets/icons/error.svg',
}

@Component({
  standalone: true,
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.scss'],
  imports: [CommonModule],
})
export class AlertMessageComponent {
  @Input() set type(value: AlertMessageType) {
    this.typeStatus = value;
    if (value === 'warn') {
      this.iconPath = AlertIconPaths.warn;
      return;
    }

    if (value === 'success') {
      this.iconPath = AlertIconPaths.success;
      return;
    }

    if (value === 'danger') {
      this.iconPath = AlertIconPaths.danger;
      return;
    }

    if (value === 'info') {
      this.iconPath = AlertIconPaths.info;
      return;
    }

    this.iconPath = '';
  }
  @Input() isClose: boolean = true;

  @Input() message: string;

  @Input() isShowCloseButton = false;

  @Output() doClose = new EventEmitter<void>();

  iconPath = '';
  typeStatus = '';
  constructor(private _store: Store<AuthState>) {}
  closeAlert() {
    this._store.dispatch(deleteLoginError());
  }
}
