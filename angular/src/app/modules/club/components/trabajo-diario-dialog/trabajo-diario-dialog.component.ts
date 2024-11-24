import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Treatments } from 'src/app/_models/player';
import { PhysiotherapyService } from 'src/app/_services/fisiotherapy.service';

@Component( {
  selector: 'trabajo-diario-dialog',
  templateUrl: './trabajo-diario-dialog.component.html',
  styleUrls: [ './trabajo-diario-dialog.component.scss' ],
} )
export class TrabajoDiarioDialogComponent implements OnInit, OnDestroy {
  step: number = 1;
  @Input() visible: boolean = false;
  @Input() player_file: any;
  @Input() dailyWorkData: any;
  @Input() date: string;
  @Output() close = new EventEmitter<boolean>();
  @Output() resetDailyWorks = new EventEmitter<boolean>();
  selectedCity!: any;
  selectedValue: any;
  treatmentsList: Treatments[] = [];
  $subscriptions = new Subscription();
  loading: boolean = false;
  player_id: any;
  team: any;
  newDailyWorkoutForm: UntypedFormGroup;
  
  constructor( private physiotherapyService: PhysiotherapyService,
               private route: ActivatedRoute,
               private appStateService: AppStateService,
               private msg: AlertsApiService,
               private formBuilder: UntypedFormBuilder ) {
  }
  get f(){
    return this.newDailyWorkoutForm.controls;
  }
  closeDialog() {
    this.close.emit( false );
    this.newDailyWorkoutForm.reset();
  }
  
  ngOnInit(): void {
    this.getTreatmentsList();
    this.team = this.appStateService.getTeam();
    this.player_id = this.route.snapshot.paramMap.get( 'id' );
    this.loadForm( this.dailyWorkData );
  }
  
  loadForm( daily_work: any ): void {
    this.newDailyWorkoutForm = this.formBuilder.group( {
      minutes_duration: new UntypedFormControl(
        daily_work ? daily_work.minutes_duration : null,
        Validators.required
      ),
      sensations: new UntypedFormControl( daily_work ? daily_work.sensations : '' ),
      exploration: new UntypedFormControl( daily_work ? daily_work.exploration : '' ),
      tests: new UntypedFormControl( daily_work ? daily_work.tests : '' ),
      observations: new UntypedFormControl( daily_work ? daily_work.observations : '' ),
      treatments: new UntypedFormControl( null, Validators.required ),
    } );
  }
  
  getTreatmentsList(): void {
    this.$subscriptions = this.physiotherapyService
      .getTratmentsList()
      .subscribe( ( res ) => {
        if ( res.success ) {
          this.treatmentsList = res.data.map( ( item: any ) => ( {
            label: item.name,
            value: item.id,
          } ) );
          if ( this.dailyWorkData ) {
            this.newDailyWorkoutForm
              .get( 'treatments' )
              ?.setValue( this.dailyWorkData.treatments );
          } else {
            this.newDailyWorkoutForm
              .get( 'treatments' )
              ?.setValue( this.treatmentsList[ 0 ].id );
          }
        }
      } );
  }
  
  /**
   * submit form
   */
  onSubmit(): void {
    this.loading = true;
    const dailyWork = {
      ...this.newDailyWorkoutForm.value,
      work_date: this.date || moment( new Date() ).format( 'YYYY-MM-DD' ),
    };
    this.$subscriptions = this.physiotherapyService.createDailyWork(
      dailyWork,
      this.team.id,
      this.player_file?.length > 0 ? this.player_file[ 0 ].id : this.player_id,
      this.player_file?.length > 0
        ? this.player_file[ 0 ].latest_file_fisiotherapy?.id
        : this.player_file ).subscribe( ( res ) => {
        if ( res.success ) {
          this.msg.succes( res.message );
          this.closeDialog();
          this.resetDailyWorks.emit( true );
        }
        this.loading = false;
      },
      ( { error } ) => {
        this.msg.error( error );
      }
    );
  }
  
  ngOnDestroy(): void {
    if ( this.$subscriptions ) {
      this.$subscriptions.unsubscribe();
    }
  }
}
