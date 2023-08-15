import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-logo-with-title',
  templateUrl: './logo-with-title.component.html',
  styleUrls: ['./logo-with-title.component.scss']
})
export class LogoWithTitleComponent {

  @Input() title: string;

}
