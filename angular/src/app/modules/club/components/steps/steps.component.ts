import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component( {
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: [ './steps.component.scss' ]
} )
export class StepsComponent implements OnInit {
  @Input() steps: any[];
  @Input() validateDisable: boolean = false;
  @Output()
  nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Input() step: number = 1;

  constructor() {
  }

  ngOnInit(): void {
  }

  selectItem( id: number, data: any ) {
    if (this.validateDisable){
      if (!data.disabled){
        this.nextstep.emit( id );
        this.step = id;
      }
    }else{
      this.nextstep.emit( id );
      this.step = id;
    }
  }
}
