import { Component, OnInit, Input } from '@angular/core';

@Component( {
  selector: 'app-save-changes-dialog',
  templateUrl: './save-changes-dialog.component.html',
  styleUrls: [ './save-changes-dialog.component.scss' ]
} )
export class SaveChangesDialogComponent implements OnInit {

  @Input() visible: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
