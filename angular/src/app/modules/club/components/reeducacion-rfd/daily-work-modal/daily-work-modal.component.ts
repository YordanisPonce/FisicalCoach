import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { InjuryService } from 'src/app/_services/injury.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-daily-work-modal',
  templateUrl: './daily-work-modal.component.html',
  styleUrls: ['./daily-work-modal.component.scss'],
})
export class DailyWorkModalComponent implements OnInit, OnDestroy {
  constructor(
    private injuryService: InjuryService,
    private route: ActivatedRoute,
    private appStateService: AppStateService,
    private msg: AlertsApiService
  ) {}

  step: number = 1;
  @Input() visible: boolean = false;
  @Input() dailyWorkDay: string;
  @Input() dailyWork: any;
  @Input() rfd_id: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshCalendar = new EventEmitter<boolean>();

  selectedCity!: any;
  $subscriptions = new Subscription();
  loading: boolean = false;
  player_id: any;
  team: any;
  openResultDialog: boolean = false;
  resources = environment.images + 'images';
  dailyWorkResults = {
    control_test: false,
    monotony: 0,
    training_load: 0,
    training_strain: 0,
  };
  newDailyWorkoutForm: UntypedFormGroup;

  rpeList = [
    {
      icon: '0_grey_face.svg',
      value: 0,
      text: 'rest',
    },
    {
      icon: '5_green_face.svg',
      value: 1,
      text: 'very_very_Light',
    },
    {
      icon: '5_green_face.svg',
      value: 2,
      text: 'very_light',
    },
    {
      icon: '4_Blue_face.svg',
      value: 3,
      text: 'light',
    },
    {
      icon: '4_Blue_face.svg',
      value: 4,
      text: 'moderate',
    },
    {
      icon: '3_yellow_face.svg',
      value: 5,
      text: 'somewhat_hard',
    },
    {
      icon: '3_yellow_face.svg',
      value: 6,
      text: 'hard',
    },
    {
      icon: '2_orange_face.svg',
      value: 7,
      text: 'very_hard',
    },
    {
      icon: '2_orange_face.svg',
      value: 8,
      text: 'very_very_hard',
    },
    {
      icon: '1_red_face.svg',
      value: 9,
      text: 'maximal',
    },
    {
      icon: '1_red_face.svg',
      value: 10,
      text: 'extreme',
    },
  ];

  closeDialog() {
    this.close.emit(false);
    this.newDailyWorkoutForm.reset();
  }

  closeResultDialog() {
    this.openResultDialog = false;
    this.newDailyWorkoutForm.reset();
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.player_id = this.route.snapshot.paramMap.get('id');
    this.loadForm();
  }

  /**
   * load form existing data
   */
  loadForm(): void {
    this.newDailyWorkoutForm = new UntypedFormGroup({
      duration: new UntypedFormControl(
        this.dailyWork ? parseInt(this.dailyWork.duration) : 0,
        Validators.required
      ),
      rpe: new UntypedFormControl(
        this.dailyWork ? this.dailyWork.rpe : null,
        Validators.required
      ),
      test: new UntypedFormControl(
        this.dailyWork ? this.dailyWork.test : '',
        Validators.required
      ),
      description: new UntypedFormControl(
        this.dailyWork ? this.dailyWork.description : '',
        Validators.required
      ),
      control_test: new UntypedFormControl(
        this.dailyWork ? this.dailyWork.control_test : true,
        Validators.required
      ),
    });
  }

  /**
   * set rpe
   */
  setRpeValue(value: number): void {
    this.newDailyWorkoutForm.get('rpe')?.setValue(value);
  }

  /**
   * submit form
   */
  onSubmit(): void {
    this.loading = true;

    const dailyWork = {
      ...this.newDailyWorkoutForm.value,
      duration: this.newDailyWorkoutForm.get('duration')?.value.toString(),
      injury_rfd_id: this.rfd_id,
      day: this.dailyWorkDay,
    };

    this.$subscriptions = this.injuryService
      .createDailyWork(dailyWork)
      .subscribe(
        (res) => {
          if (res.success) {
            const data = res.data;

            this.dailyWorkResults.control_test = data.control_test;
            this.dailyWorkResults.monotony = data.monotony;
            this.dailyWorkResults.training_load = data.training_load;
            this.dailyWorkResults.training_strain = data.training_strain;

            this.openResultDialog = true;
            this.refreshCalendar.emit(true);
          }

          this.loading = false;
        },
        ({ error }) => {
          console.log(error);
          this.loading = false;
          this.msg.error(error);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
