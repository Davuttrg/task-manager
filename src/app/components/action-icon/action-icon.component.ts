import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'action-icon',
  templateUrl: './action-icon.component.html',
  styleUrls: ['./action-icon.component.scss'],
})
export class ActionIconComponent implements OnInit {
  @Input() icon: string = '';
  @Input() text: string = '';
  @Output() clickAction: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  actionClicked() {
    this.clickAction.emit();
  }
}
