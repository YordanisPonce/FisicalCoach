import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'medal-dialog',
  templateUrl: './medal-dialog.component.html',
  styleUrls: ['./medal-dialog.component.scss']
})
export class MedalDialogComponent implements OnInit {

  constructor() { }

  @Input() visible: boolean = false
  @Input() success: boolean = false
  @Input() title:string
  @Input() msg:string

  @Output() close = new EventEmitter<boolean>();

  images:string = environment.images

  closeDialog() {
    this.close.emit( false );
  }

  ngOnInit(): void {
  }

}
