import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, } from '@angular/core';
import { ComponentBaseClass } from './componentBase.class';
import { InjuryService } from '../../../../../_services/injury.service';
import { AppStateQuery } from '../../../../../stateManagement/appState.query';
import * as moment from 'moment';
import { Injury } from 'src/app/_models/injury';
import { Player } from 'src/app/_models/player';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { forkJoin, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IListaItem } from 'src/app/_models/IListaItem';

@Component( {
  selector: 'app-new-injuries',
  templateUrl: './new-injuries.component.html',
  styleUrls: [ './new-injuries.component.scss' ],
} )
export class NewInjuriesComponent implements OnInit, OnDestroy, AfterViewInit {
  step = 1;
  @Input() showModal = false;
  @Input() physiotherapyPlayer: Player;
  @Output() dismiss: EventEmitter<any> = new EventEmitter();
  @ViewChild( 'componenteInjuryCause' ) componenteInjuryCause: ComponentBaseClass;
  @ViewChild( 'componenteInjuryProfile' )
  componenteInjuryProfile: ComponentBaseClass;
  @ViewChild( 'componenteInjuryPrognosis' )
  componenteInjuryPrognosis: ComponentBaseClass;
  @ViewChild( 'componenteInjurySurgery' )
  componenteInjurySurgery: ComponentBaseClass;
  @ViewChild( 'componenteInjuryClinical' )
  componenteInjuryClinical: ComponentBaseClass;
  
  formDataCause: Injury;
  formDataProfile: Injury;
  formDataPrognosis: Injury;
  formDataSurgery: Injury;
  formDataClinical: Injury;
  subs: Subscription;
  player: any;
  @Input() detalle: boolean;
  @Input() injury: any;
  @Input() playerId: any;
  
  listMechanismsInjury: IListaItem[] = [];
  listInjuryExtrinsicFactors: IListaItem[] = [];
  listInjuryIntrinsicFactors: IListaItem[] = [];
  listInjurySituationTypes: IListaItem[] = [];
  
  stepTitles: string[];
  minDate: Date = new Date();
  loading: boolean = false;
  
  role: 'teacher' | 'sport';
  
  constructor( private injuryService: InjuryService,
               private cdRef: ChangeDetectorRef,
               private appStateQuery: AppStateQuery,
               public msg: AlertsApiService,
               private translate: TranslateService
  ) {
  }
  
  ngAfterViewInit(): void {
    if ( this.detalle ) {
      this.setInjuryCause( this.injury );
      this.setInjuryProfile( this.injury );
      this.setInjuryPrognosis( this.injury );
      this.setInjurySurgery( this.injury );
      this.setInjuryClinicalTest( this.injury );
      this.cdRef.detectChanges();
    }
  }
  
  ngOnInit(): void {
    this.role = localStorage.getItem( 'role' ) as 'teacher' | 'sport';
    console.log( this.physiotherapyPlayer );
    
    this.cargarListados();
    forkJoin(
      this.translate.get( 'INJURY.LBL_INJURY_PROFILE' ),
      this.translate.get( 'INJURY.LBL_INJURY_TIME' ),
      this.translate.get( 'INJURY.LBL_INJURY_FORECAST' ),
      this.translate.get( 'INJURY.LBL_SURGERY' ),
      this.translate.get( 'INJURY.LBL_CLINICAL_TEST' )
    ).subscribe(
      ( [
          injury_profile,
          injury_time,
          injury_forecast,
          surgery,
          clinical_test,
        ] ) => {
        this.stepTitles = [
          injury_profile,
          injury_time,
          injury_forecast,
          surgery,
          clinical_test,
        ];
      }
    );
    
    this.subs = this.appStateQuery.player$.subscribe( ( res ) => {
      this.player = res;
    } );
  }
  
  getBack() {
    if ( this.step > 1 ) {
      this.step--;
      return;
    } else {
      this.showModal = false;
      this.injury = null;
    }
  }
  
  setInjuryCause( data: Injury ) {
    this.formDataCause = {} as Injury;
    this.formDataCause.injury_date = data.injury_date;
    this.formDataCause.mechanism_injury_id = data.mechanism_injury_id;
    this.formDataCause.injury_situation_id = data.injury_situation_id;
    this.formDataCause.injury_intrinsic_factor_id =
      data.injury_intrinsic_factor_id;
    this.formDataCause.injury_extrinsic_factor_id =
      data.injury_extrinsic_factor_id;
    this.formDataCause.is_triggered_by_contact = data.is_triggered_by_contact;
  }
  
  setInjuryProfile( data: Injury ) {
    this.formDataProfile = {} as Injury;
    this.formDataProfile.injury_type_id = data.injury_type_id;
    this.formDataProfile.injury_type_spec_id = data.injury_type_spec_id;
    this.formDataProfile.is_relapse = data.is_relapse;
    this.formDataProfile.affected_side_id = data.affected_side_id;
    this.formDataProfile.injury_location_id = data.injury_location_id;
    this.formDataProfile.detailed_location = data.detailed_location;
    this.formDataProfile.injury_severity_id = data.injury_severity_id;
  }
  
  setInjuryPrognosis( data: Injury ) {
    this.formDataPrognosis = {} as Injury;
    this.formDataPrognosis.injury_forecast = data.injury_forecast;
    this.formDataPrognosis.medically_discharged_at =
      data.medically_discharged_at;
    this.formDataPrognosis.days_off = data.days_off;
    this.formDataPrognosis.sportly_discharged_at = data.sportly_discharged_at;
    this.formDataPrognosis.matches_off = data.matches_off;
    this.formDataPrognosis.competitively_discharged_at =
      data.competitively_discharged_at;
  }
  
  setInjurySurgery( data: Injury ) {
    this.formDataPrognosis = {} as Injury;
    this.formDataPrognosis.surgery_date = data.surgery_date;
    this.formDataPrognosis.medical_center_name = data.medical_center_name;
    this.formDataPrognosis.surgeon_name = data.surgeon_name;
    this.formDataPrognosis.surgery_extra_info = data.surgery_extra_info;
  }
  
  setInjuryClinicalTest( data: Injury ) {
    this.formDataPrognosis = {} as Injury;
    this.formDataPrognosis.clinical_test_types = data.clinical_test_types;
    this.formDataPrognosis.detailed_diagnose = data.detailed_diagnose;
  }
  
  handleNext() {
    switch ( this.step ) {
      case 1:
        this.nextStep( this.componenteInjuryProfile );
        break;
      case 2:
        this.nextStep( this.componenteInjuryCause );
        this.minDate = new Date( this.formDataProfile.injury_date );
        break;
      case 3:
        this.nextStep( this.componenteInjuryPrognosis );
        break;
      case 4:
        this.nextStep( this.componenteInjurySurgery );
        break;
      case 5:
        this.nextStep( this.componenteInjuryClinical );
        break;
    }
  }
  
  closeModal() {
    this.dismiss.emit( false );
  }
  
  nextStep( component: ComponentBaseClass ) {
    if ( component.validateForm() ) {
      if ( this.step < 5 ) {
        this.step++;
      } else {
        if ( this.detalle ) {
          this.dismiss.emit( false );
          return;
        }
        this.saveInjury();
      }
    } else {
      return;
    }
  }
  
  saveInjury() {
    this.loading = true;
    this.formDataCause.injury_date = moment(
      this.formDataCause.injury_date
    ).format( 'YYYY-MM-DD' );
    const dataTemp1 = Object.assign( this.formDataCause, this.formDataProfile );
    const dataTemp2 = Object.assign( dataTemp1, this.formDataClinical );
    const dataTemp3 = Object.assign( dataTemp2, this.formDataPrognosis );
    const dataTemp4 = Object.assign( dataTemp3, this.formDataSurgery );
    if ( this.physiotherapyPlayer ) {
      this.injuryService.create( dataTemp4, String( this.physiotherapyPlayer.id ), this.role === 'teacher' )
        .subscribe( ( res ) => {
            this.dismiss.emit( false );
            this.msg.succes( res.message );
            this.step = 1;
            this.loading = false;
          }, ( { error } ) => {
            this.msg.error( error );
            this.loading = false;
          }
        );
    } else {
      this.injuryService.create( dataTemp4, this.player ).subscribe( ( res ) => {
        this.dismiss.emit( false );
      } );
    }
  }
  
  ngOnDestroy(): void {
    if ( this.subs ) {
      this.subs.unsubscribe();
    }
  }
  
  cargarListados() {
    console.log( 'here' );
    this.injuryService.getListInjurySituationTypes().subscribe(
      ( res: any ) => {
        this.listInjurySituationTypes = res.data.map(
          ( item: { name: string; id: number } ) => ( {
            value: item.id,
            label: item.name,
          } )
        );
        
        this.injuryService.getListMechanismsInjury().subscribe(
          ( res: any ) => {
            this.listMechanismsInjury = res.data.map(
              ( item: { name: string; id: number } ) => ( {
                value: item.id,
                label: item.name,
              } )
            );
            
            this.injuryService.getListInjuryIntrinsicFactors().subscribe(
              ( res: any ) => {
                this.listInjuryIntrinsicFactors = res.data.map(
                  ( item: { name: string; id: number } ) => ( {
                    value: item.id,
                    label: item.name,
                  } )
                );
                
                this.injuryService.getListInjuryExtrinsicFactors().subscribe(
                  ( res: any ) => {
                    this.listInjuryExtrinsicFactors = res.data.map(
                      ( item: { name: string; id: number } ) => ( {
                        value: item.id,
                        label: item.name,
                      } )
                    );
                  },
                  ( error ) => {
                    console.log( error );
                  }
                );
              },
              ( error ) => {
                console.log( error );
              }
            );
          },
          ( error ) => {
            console.log( error );
          }
        );
      },
      ( error ) => {
        console.log( error );
      }
    );
  }
  
  setDataSetp( data: any, step: number ) {
    if ( step === 1 ) {
      this.formDataProfile = data;
    }
  }
}
