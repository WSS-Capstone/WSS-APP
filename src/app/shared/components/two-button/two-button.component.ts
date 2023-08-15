import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-two-button',
  templateUrl: './two-button.component.html',
  styleUrls: ['./two-button.component.scss']
})
export class TwoButtonComponent {
  @Input() isAbleFirstButton = false;
  @Input() isAbleSecondButton = false;

  @Input() firstLabel = 'First Button';
  @Input() secondLabel = 'Second Button';

  @Input() isLoading = false;

  @Output() doClickFirstElement = new EventEmitter<void>();
  @Output() doClickSecondElement = new EventEmitter<void>();


  onFirstClick() {
    this.doClickFirstElement.emit();
  }

  onSecondClick() {
    this.doClickSecondElement.emit();
  }
}
