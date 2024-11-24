import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-introduction-dialog',
  templateUrl: './test-introduction-dialog.component.html',
  styleUrls: ['./test-introduction-dialog.component.scss'],
})
export class TestIntroductionDialogComponent implements OnInit {
  @Input() open: boolean = false;
  @Input() imageUrl: string;
  @Input() description: string;
  @Output() close = new EventEmitter<boolean>();
  @Output() openTest = new EventEmitter<boolean>();

  resources = environment.images + 'images/';

  constructor() {}

  ngOnInit(): void {}

  openTestDialog(): void {
    this.openTest.emit(true);
  }

  closeDialog(): void {
    this.close.emit(false);
  }
}
