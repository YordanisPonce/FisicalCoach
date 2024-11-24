import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ComponentBaseClass } from '../injuries/new-injuries/componentBase.class';
import { Injury } from '../../../../_models/injury';
import * as moment from 'moment';
import { InjuryService } from '../../../../_services/injury.service';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { Player } from 'src/app/_models/player';
import { forkJoin } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { IListaItem } from 'src/app/_models/IListaItem';
import { ITeam } from 'src/app/_models/ITeam.interface';

@Component({
  selector: 'app-new-rfd-dialog',
  templateUrl: './new-rfd-dialog.component.html',
  styleUrls: ['./new-rfd-dialog.component.scss'],
})
export class NewRfdDialogComponent implements OnInit, AfterViewInit {
  selectedCity!: any;
  selectedValue: any;
  formDataCause: Injury;
  formDataProfile: Injury;
  formDataSurgery: Injury;
  formDataClinical: Injury;
  listMechanismsInjury: IListaItem[] = [];
  listInjuryExtrinsicFactors: IListaItem[] = [];
  listInjuryIntrinsicFactors: IListaItem[] = [];
  listInjurySituationTypes: IListaItem[] = [];
  locale = localStorage.getItem('languaje');
  step = 1;
  @Input() detalle: boolean;
  @Input() selectedPlayer: Player;
  @Input() rfdData: any;

  @ViewChild('componenteInjuryCause') componenteInjuryCause: ComponentBaseClass;
  @ViewChild('componenteInjuryProfile')
  componenteInjuryProfile: ComponentBaseClass;
  @ViewChild('componenteInjurySurgery')
  componenteInjurySurgery: ComponentBaseClass;
  @ViewChild('componenteAddionalInfo')
  componenteAddionalInfo: ComponentBaseClass;
  @Input() showModal: boolean;
  @Input() injury: any;
  @Output() dismiss: EventEmitter<boolean> = new EventEmitter();
  @Output() resetPlayerList: EventEmitter<boolean> = new EventEmitter();
  prognosis: boolean = true;
  player: any;
  resetForm: boolean = false;
  loading: boolean;
  rdfInjuryData: any;
  team: ITeam;

  constructor(
    private injuryService: InjuryService,
    public msg: AlertsApiService,
    private cdRef: ChangeDetectorRef,
    private appStateService: AppStateService
  ) {}
  ngAfterViewInit(): void {
    if (this.detalle) {
      this.setInjuryCause(this.injury);
      this.setInjuryProfile(this.injury);
      this.setInjurySurgery(this.injury);
      this.setInjuryClinicalTest(this.injury);
      this.cdRef.detectChanges();
    }
  }
  setInjuryCause(data: Injury) {
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

  setInjuryProfile(data: Injury) {
    this.formDataProfile = {} as Injury;
    this.formDataProfile.injury_type_id = data.injury_type_id;
    this.formDataProfile.injury_type_spec_id = data.injury_type_spec_id;
    this.formDataProfile.is_relapse = data.is_relapse;
    this.formDataProfile.affected_side_id = data.affected_side_id;
    this.formDataProfile.injury_location_id = data.injury_location_id;
    this.formDataProfile.detailed_location = data.detailed_location;
    this.formDataProfile.injury_severity_id = data.injury_severity_id;
  }

  setInjurySurgery(data: Injury) {
    this.formDataSurgery = {} as Injury;
    this.formDataSurgery.surgery_date = data.surgery_date;
    this.formDataSurgery.medical_center_name = data.medical_center_name;
    this.formDataSurgery.surgeon_name = data.surgeon_name;
    this.formDataSurgery.surgery_extra_info = data.surgery_extra_info;
  }

  setInjuryClinicalTest(data: Injury) {
    this.formDataClinical = {} as Injury;
    this.formDataClinical.clinical_test_types = data.clinical_test_types;
    this.formDataClinical.surgery_extra_info = data.surgery_extra_info;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.cargarListados();

    forkJoin(
      this.injuryService.getListInjuryLocations(),
      this.injuryService.getListInjurySeverities(),
      this.injuryService.getListInjuryAffectedSideTypes(),
      this.injuryService.getListInjuryTypes(),
      this.injuryService.getListClinicalTestTypes()
    ).subscribe(
      ([
        injuryLocations,
        injurySeverities,
        injuryAffectedSideTypes,
        injuryTypes,
        clinicalTestTypes,
      ]) => {
        const dataList = {
          injuryLocations: injuryLocations.data,
          injurySeverities: injurySeverities.data,
          injuryAffectedSideTypes: injuryAffectedSideTypes.data,
          injuryTypes: injuryTypes.data,
          clinicalTestTypes: clinicalTestTypes.data,
        };
        this.appStateService.updateListInjuries(dataList);
      }
    );
  }

  closeDialog() {
    // this.advancedDialog = false
    this.dismiss.emit(false);
    this.resetForm = true;
    this.step = 1;

    setTimeout(() => {
      this.resetForm = false;
    }, 1000);
  }

  setDataSetp(data: any, step: number) {
    if (step === 1) {
      this.formDataCause = data;
    }
  }

  getBack() {
    if (this.step > 1) {
      this.step--;
      return;
    } else {
      this.showModal = false;
      this.injury = null;
    }
  }

  /**
   * validate form steps
   */
  handleNext() {
    switch (this.step) {
      case 1:
        this.nextStep(this.componenteInjuryProfile);
        break;
      case 2:
        this.nextStep(this.componenteInjuryCause);
        break;
      case 3:
        this.nextStep(this.componenteInjurySurgery);
        break;
      case 4:
        this.nextStep(this.componenteAddionalInfo);
        break;
    }
  }

  /**
   * go to next form step
   * @param component
   * @returns null
   */
  nextStep(component: ComponentBaseClass) {
    if (component.validateForm()) {
      if (this.step < 4) {
        this.step++;
      } else {
        if (this.detalle) {
          this.dismiss.emit(false);
          return;
        }
        this.saveInjury();
      }
    } else {
      return;
    }
  }

  cargarListados() {
    this.injuryService.getListInjurySituationTypes().subscribe(
      (res: any) => {
        this.listInjurySituationTypes = res.data.map(
          (item: { name: string; id: number }) => ({
            label: item.name,
            value: item.id,
          })
        );

        this.injuryService.getListMechanismsInjury().subscribe(
          (res: any) => {
            this.listMechanismsInjury = res.data.map(
              (item: { name: string; id: number }) => ({
                label: item.name,
                value: item.id,
              })
            );

            this.injuryService.getListInjuryIntrinsicFactors().subscribe(
              (res: any) => {
                this.listInjuryIntrinsicFactors = res.data.map(
                  (item: { name: string; id: number }) => ({
                    label: item.name,
                    value: item.id,
                  })
                );

                this.injuryService.getListInjuryExtrinsicFactors().subscribe(
                  (res: any) => {
                    this.listInjuryExtrinsicFactors = res.data.map(
                      (item: { name: string; id: number }) => ({
                        label: item.name,
                        value: item.id,
                      })
                    );
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * store injury
   */
  saveInjury() {
    this.formDataCause.injury_date = moment(
      this.formDataCause.injury_date
    ).format('YYYY-MM-DD');
    const dataTemp1 = Object.assign(this.formDataCause, this.formDataProfile);
    const dataTemp2 = Object.assign(dataTemp1, this.formDataSurgery);
    const dataTemp3 = Object.assign(dataTemp2, this.formDataClinical);

    this.loading = true;

    this.injuryService
      .create(dataTemp3, String(this.selectedPlayer.player_id))
      .subscribe(
        (res) => {
          if (res.success) {
            this.injuryService
              .createInjuryRfd({
                injury_id: res.data.id,
                team_id: this.team.id,
              })
              .subscribe(
                (res) => {
                  this.dismiss.emit(false);
                  this.msg.succes(res.message);
                  this.loading = false;
                  this.resetPlayerList.emit(true);
                },
                ({ error }) => {
                  this.msg.error(error);
                  this.loading = false;
                }
              );
          }
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
  }
}
