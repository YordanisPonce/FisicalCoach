import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SelectItem } from '../../../../../_models/selectItem';
import * as moment from 'moment';
import { PlayersService } from '../../../../../_services/players.service';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import HandleErrors from '../../../../../utils/errors';
import { AlertsApiService } from '../../../../../generals-services/alerts-api.service';
import { TranslateService } from '@ngx-translate/core';
import { ContractInterface } from '../../../../../_models/contract.interface';
import { ITeam } from '../../../../../_models/ITeam.interface';
import { AppStateService } from '../../../../../stateManagement/appState.service';

@Component( {
  selector: 'app-player-working-data',
  templateUrl: './player-working-data.component.html',
  styleUrls: [ './player-working-data.component.scss' ]
} )
export class PlayerWorkingDataComponent implements OnInit, OnDestroy {
  showModal = false;
  submitted = false;
  formAddContract: UntypedFormGroup;
  listYears: SelectItem [] = [];
  listContracts: ContractInterface[] = [];
  maxDate = new Date();
  saving = false;
  yearRange: any;
  idPlayer: number;
  viewDataContract: any = {};
  view = false;
  loading = false;
  @Input() data: any;
  subs: Subscription;
  error: HandleErrors = new HandleErrors( this.alertsApiService );
  image: any;
  imagePreview: any;
  detail:boolean=false;
  team: ITeam;
  constructor( private formBuilder: UntypedFormBuilder,
               public alertsApiService: AlertsApiService,
               private appStateQuery: AppStateQuery,
               private appStateService: AppStateService,
               private translateService: TranslateService,
               private playerService: PlayersService, ) {
  }
  
  get f() {
    return this.formAddContract.controls;
  }
  
  ngOnInit(): void {
    this.team= this.appStateService.getTeam();
    if ( this.data && this.data.id ) {
      this.idPlayer = this.data.id;
    }
    this.yearRange = '1900:' + new Date().getFullYear();
    this.loadForm();
    this.getListYears();
    this.getListContracts();
    this.subs = this.appStateQuery.player$.subscribe( res => {
      this.idPlayer = res.id;
      this.getListContracts();
    } );
  }
  
  loadForm() {
    this.detail=false;
    this.formAddContract = this.formBuilder.group( {
      contract_creation: [ this.viewDataContract?.contract_creation || null, Validators.required ],
      duration: [ this.viewDataContract?.duration || null, Validators.required ],
      year_duration: [ this.viewDataContract?.duration ],
      title: [ this.viewDataContract?.title || null, Validators.required ],
      image: [ this.viewDataContract?.image || null ],
    } );
  }
  
  loadFormView() {
    this.detail=true;
    this.formAddContract = this.formBuilder.group( {
      contract_creation: [ { value: this.viewDataContract.contract_creation, disabled: true }, Validators.required ],
      duration: [ { value: this.viewDataContract?.year_duration, disabled: true }, Validators.required ],
      year_duration: [ { value: this.viewDataContract?.year_duration, disabled: true } ],
      title: [ { value: this.viewDataContract?.title, disabled: true }, Validators.required ],
    } );
    this.image = this.viewDataContract?.image;
    this.formAddContract.disable();
    this.formAddContract.updateValueAndValidity();
  }
  
  onSubmit() {
    this.submitted = true;
    if ( this.formAddContract.invalid ) {
      return;
    }
    this.saving = true;
    const data = this.formAddContract.getRawValue();
    data.contract_creation = moment( data.contract_creation ).format( 'YYYY-MM-DD' );
    data.year_duration = data.duration;
    data.team_id= this.team.id;
    this.playerService.addContract( data, this.idPlayer, this.image ).then( r => {
      this.saving = false;
      this.formAddContract.reset();
      this.submitted = false;
      this.showModal = false;
      this.getListContracts();
      this.alertsApiService.succes( this.translateService.instant( 'PLAYERS.CONTRATOADD' ) );
    } ).catch( error => {
      this.saving = false;
      this.error.handleError( error, this.translateService.instant( 'PLAYERS.ERRORCONTRATO' ) );
    } );
  }
  
  getListYears() {
    const year = moment( new Date(), 'DD/MM/YYYY' ).year();
    for ( let i = 0; i <= 30; i++ ) {
      this.listYears.push( { value: year - i, label: ( year - i ).toString() } );
    }
  }
  
  getListContracts() {
    this.loading = true;
    this.playerService.getContracts( this.idPlayer ).subscribe( r => {
      this.listContracts = r.data ? r.data : [];
      this.listContracts.map( x => {
        x.date_end = ( moment( x.contract_creation ).add( x.year_duration, 'years' ) ).format( 'DD/MM/YYYY' );
        x.date_start = moment( x.contract_creation ).format( 'DD/MM/YYYY' );
        x.contract_creation = new Date( x.contract_creation );
      } );
      this.loading = false;
    } );
  }
  
  viewContract( data: any ) {
    this.view = true;
    this.viewDataContract = data;
    this.loadFormView();
    this.showModal = true;
  }
  
  handleInit() {
    this.view = false;
    this.viewDataContract = {};
    this.loadForm();
    this.showModal = true;
    this.imagePreview = null;
    this.image = null;
  }
  
  uploaderFile( event: any ) {
    this.preview( event.files[ 0 ] );
    this.image = event.files[ 0 ];
    this.formAddContract.controls.image.setValue( this.image );
    this.formAddContract.controls.image.updateValueAndValidity();
    
  }
  
  async fileUpload( event: any, tipo: string ) {
    const file = event.target.files[ 0 ];
    this.image = file;
    this.preview( file );
  }
  
  deleteImage() {
    this.image = null;
    this.imagePreview = null;
    this.formAddContract.controls.image.setValue( null );
    this.formAddContract.controls.image.updateValueAndValidity();
  }
  
  preview( file: File ) {
    if ( !file ) {
      return;
    }
    const mimeType = file.type;
    if ( mimeType.match( /image\/*/ ) == null ) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = ( event ) => {
      this.imagePreview = { full_url: reader.result, id: null };
    };
  }
  
  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }
}
