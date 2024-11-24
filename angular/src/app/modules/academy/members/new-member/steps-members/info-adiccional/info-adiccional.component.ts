import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component( {
  selector: 'app-info-adiccional',
  templateUrl: './info-adiccional.component.html',
  styleUrls: [ './info-adiccional.component.scss' ]
} )
export class InfoAdiccionalComponent implements OnInit {

  formMember: UntypedFormGroup;
  submitted: boolean = false;
  @Input() saving = false;
  @Input() data: any;
  @Output()
  nextstep: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  goBack: EventEmitter<void> = new EventEmitter<void>();
  @Input() view: boolean;

  constructor( private formBuilder: UntypedFormBuilder ) {
  }

  ngOnInit(): void {
    this.loadForm();
  }

  getScreenWidth(): any {
    return screen.width;
  }

  loadForm(): void {
    this.formMember = this.formBuilder.group( {
      additional_information: [ this.data && this.data.additional_information ? this.data.additional_information : '' ],
    } );
  }


  onSubmit() {
    this.submitted = true;
    if ( this.formMember.invalid ) {
      return;
    }
    const data = this.formMember.value;
    this.nextstep.emit( data );
  }

  back() {
    this.goBack.emit();
  }
}
