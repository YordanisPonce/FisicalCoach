import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Injury } from 'src/app/_models/injury';
import { Player, PlayerFile } from 'src/app/_models/player';
import { PhysiotherapyService } from 'src/app/_services/fisiotherapy.service';
import { TeamService } from 'src/app/_services/team.service';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { InjuryService } from 'src/app/_services/injury.service';
import moment from 'moment';

@Component({
  selector: 'app-new-tab-dialog',
  templateUrl: './new-tab-dialog.component.html',
  styleUrls: ['./new-tab-dialog.component.scss'],
})
export class NewTabDialogComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    private appStateService: AppStateService,
    private teamService: TeamService,
    private physiotherapyService: PhysiotherapyService,
    public msg: AlertsApiService,
    private injuryService: InjuryService
  ) {}

  step: number = 1;
  @Input() visible: boolean = false;
  @Input() player_id: Player[] = [];

  @Input() playerFileDetails: PlayerFile;
  @Output() close = new EventEmitter<boolean>();
  @Output() refresPlayerList = new EventEmitter<boolean>();
  @Output() refreshPlayerInjuries = new EventEmitter<boolean>();

  newFileForm = new UntypedFormGroup({
    title: new UntypedFormControl('', Validators.required),
    team_staff_id: new UntypedFormControl(null, Validators.required),

    anamnesis: new UntypedFormControl(''),
    has_medication: new UntypedFormControl(false),
    medication: new UntypedFormControl(''),
    // medication: new FormControl('', Validators.required),
    medication_objective: new UntypedFormControl('', Validators.required),
    player_injury_id: new UntypedFormControl('', Validators.required),
    observation: new UntypedFormControl(''),
  });

  playerInjuries: Injury[] = [];
  selectedValue: any;
  loading: boolean = false;
  team: any;
  staffList: any[] = [];
  ShowInjuryModal: boolean = false;
  $subscription = new Subscription();

  validateFields = new FieldsValidation();

  get f() {
    return this.newFileForm.controls;
  }

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
    this.loading = false;

    this.step = 1;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    this.getStaffByTeam(this.team.id);

    this.getInjuries(this.player_id[0].id);
  }

  /**
   * refresh injuries
   */
  getInjuries(id: number): void {
    this.$subscription = this.injuryService
      .getAllInjuries(id)
      .subscribe((res) => {
        if (res.success) {
          this.playerInjuries = res?.data?.injuries?.map((item: Injury) => {
            const name = `${item.location?.name} - ${moment(
              item.injury_date
            ).format('DD-MM-YYYY')}`;

            return {
              ...item,
              name,
            };
          });

          if (!this.playerFileDetails?.discharge_date) {
            const injury = this.playerInjuries.find(
              (injury) => injury.id === this.playerFileDetails?.injury_id
            );

            this.newFileForm.get('player_injury_id')?.setValue(injury);
          }
        }
      });
  }

  validateStep() {
    switch (this.step) {
      case 1:
        if (
          !this.validateFields.validateStepFields(
            ['title', 'team_staff_id'],
            this.newFileForm
          )
        )
          this.step = this.step + 1;
        break;

      case 2:
        if (
          !this.validateFields.validateStepFields(
            ['medication_objective'],
            this.newFileForm
          )
        )
          this.step = this.step + 1;
        break;

      case 3:
        break;

      default:
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.playerFileDetails);
    if (this.playerFileDetails && !this.playerFileDetails.discharge_date) {
      let staff = null;

      if (this.staffList.length > 0) {
        staff = this.staffList.find(
          (staff) => staff.id === this.playerFileDetails.team_staff_id
        );
      }

      this.newFileForm.get('title')?.setValue(this.playerFileDetails.title);
      this.newFileForm
        .get('anamnesis')
        ?.setValue(this.playerFileDetails.anamnesis);
      this.newFileForm
        .get('has_medication')
        ?.setValue(this.playerFileDetails.has_medication);
      this.newFileForm
        .get('medication')
        ?.setValue(this.playerFileDetails.medication);
      this.newFileForm
        .get('medication_objective')
        ?.setValue(this.playerFileDetails.medication_objective);
      this.newFileForm
        .get('observation')
        ?.setValue(this.playerFileDetails.observation);

      if (staff) this.newFileForm.get('team_staff_id')?.setValue(staff);
    }
  }

  /**
   * Get staff by team
   */
  getStaffByTeam(teamId: any): void {
    this.$subscription = this.teamService
      .getStaffByTeam(teamId)
      .subscribe((res) => {
        if (res.success) {
          this.staffList = res.data;
          this.newFileForm.get('team_staff_id')?.setValue(res.data[0]);
        }
      });
  }

  /**
   * submit form
   */
  onSubmit(): void {
    this.loading = true;

    const team_id = this.team.id;
    const player_id = this.player_id[0].id;
    const team_staff_id = this.newFileForm.get('team_staff_id')?.value.id;
    const injury_id = this.newFileForm.get('player_injury_id')?.value?.id;

    const fileData = {
      ...this.newFileForm.value,
      team_staff_id,
      injury_id,
    };

    if (this.playerFileDetails && !this.playerFileDetails?.discharge_date) {
      this.physiotherapyService
        .updateFisiotherapyFile(
          team_id,
          player_id,
          this.playerFileDetails.id,
          fileData
        )
        .subscribe(
          (res) => {
            if (res.success) {
              this.msg.succes(res.message);
              this.refresPlayerList.emit(true);
            }
            this.loading = false;
            this.newFileForm.reset();
            this.closeDialog();
          },
          ({ error }) => {
            this.loading = false;
            this.msg.error(error);
            // this.closeDialog();
          }
        );
    } else {
      this.physiotherapyService
        .createFisiotherapyFile(team_id, player_id, fileData)
        .subscribe(
          (res) => {
            if (res.success) {
              this.msg.succes(res.message);
              this.refresPlayerList.emit(true);
            }
            this.loading = false;
            this.newFileForm.reset();
            this.closeDialog();
          },
          ({ error }) => {
            this.loading = false;
            this.msg.error(error);
            // this.closeDialog();
          }
        );
    }
  }

  closeInjuryModal(data: any): void {
    this.ShowInjuryModal = false;
    this.getInjuries(this.player_id[0].id);
    this.newFileForm.patchValue({
      player_injury_id: data,
    });
  }

  ngOnDestroy(): void {
    if (this.$subscription) this.$subscription.unsubscribe();
  }
}
