import { Component } from '@angular/core';
import { LoginStore } from '../../store/login.store';
import { DestroyService } from '../../../../../core/services/destroy.service';

@Component({
  selector: 'app-login-view',
  templateUrl: './login.view.component.html',
  styleUrls: ['./login.view.component.scss'],
  providers: [LoginStore, DestroyService],
})
export class LoginViewComponent {}
