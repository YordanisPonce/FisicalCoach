import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { ProfieService } from '../../profile-services/profie.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';

@Component( {
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: [ './change-password.component.scss' ]
} )
export class ChangePasswordComponent implements OnInit {

  loading: boolean = false;
  submit = false;
  token: any = '';
  recoverPasswordDialog: boolean = false;
  showPass: boolean = false;
  showConfirmPass: boolean = false;
  subs: Subscription;
  resetPassForm: UntypedFormGroup;
  userData: any;

  constructor( private formBuilder: UntypedFormBuilder,
               private appStateQuery: AppStateQuery,
               public http: ProfieService,
               private translate: TranslateService,
               public alerts: AlertsApiService, ) {
  }

  get f() {
    return this.resetPassForm.controls;
  }

  checkPasswords: ValidatorFn = ( group: AbstractControl ): ValidationErrors | null => {
    const pass = group.get( 'password' )?.value;
    const confirmPass = group.get( 'confirmPassword' )?.value;
    return ( pass === confirmPass ) ? null : { notSame: true };
  };

  ngOnInit(): void {
    this.loadForm();
    this.appStateQuery.userData$.subscribe( res => {
      this.userData = { ...res };
    } );
  }

  loadForm() {
    this.resetPassForm = this.formBuilder.group( {
      password: [ null, [ Validators.required, Validators.minLength( 8 ),
        Validators.pattern( /^(?=.*[0-9])(?=.*[!@#.$%^&*])[a-zA-Z0-9!@#.$%^&*]{8,16}$/ ) ] ],
      confirmPassword: [ null, [ Validators.required, Validators.minLength( 8 ),
        Validators.pattern( /^(?=.*[0-9])(?=.*[!@#.$%^&*])[a-zA-Z0-9!@#.$%^&*]{8,16}$/ )
      ] ]
    }, {
      validators: this.checkPasswords
    } );
  }

  sendData() {
    this.submit = true;
    if ( this.resetPassForm.valid ) {
      this.loading = true;
      const dataForm = this.resetPassForm.value;
      const env = Object.assign( this.userData, {} );
      env.password = dataForm.password;
      env.password_confirmation = dataForm.confirmPassword;
      delete env.image;
      delete env.cover;
      this.http.sendData( env ).then( data => {
        // this.alerts.succes( this.translate.instant( 'profile.updatesuccess' ) );
        const parseData = JSON.parse( data as any );
        this.alerts.succes( parseData.message );
        this.submit = false;
        this.resetPassForm.reset();
        this.loading = false;
      } ).catch( ( error ) => {
        console.log( error );
        this.alerts.error( this.translate.instant( 'profile.updateerror' ) );
        this.submit = false;
        this.loading = false;
      } );
    } else {
      this.submit = false;
      this.alerts.error( this.translate.instant( 'profile.fieldsrequired' ) );
    }
    console.log( this.userData );
  }
}
