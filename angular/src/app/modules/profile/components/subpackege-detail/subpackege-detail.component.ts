import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component( {
  selector: 'app-subpackege-detail',
  templateUrl: './subpackege-detail.component.html',
  styleUrls: [ './subpackege-detail.component.scss' ]
} )
export class SubpackegeDetailComponent implements OnInit {

  detailSubcription: boolean = false;
  @Input() selectedPackage: any;
  @Input()
  view: boolean;

// Output prop name must be Input prop name + 'Change'
// Use in your component to write an updated value back out to the parent
  @Output()
  viewChange = new EventEmitter<boolean>();

  constructor() {
  }

  @Input() set viewDetail( value: boolean ) {
    this.detailSubcription = value;
  }

  ngOnInit(): void {
  }

  close() {
    this.view = false;
    this.viewChange.emit( this.view );
  }

  onHide() {
    this.view = false;
    this.viewChange.emit( this.view );
  }
}
