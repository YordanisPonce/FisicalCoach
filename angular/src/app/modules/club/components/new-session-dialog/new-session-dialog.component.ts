import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  UntypedFormBuilder,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import {
  SessionPlace,
  Target,
  TrainingExerciseSession,
  TrainingPeriod,
  TrainingSessionForm,
  TrainingSessionType,
} from 'src/app/_models/training';
import { TrainingSessionService } from 'src/app/_services/training.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import moment from 'moment';

import { isEmpty } from 'lodash';
import { Club } from 'src/app/_models/club';
import { Router } from '@angular/router';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'new-session-dialog',
  templateUrl: './new-session-dialog.component.html',
  styleUrls: ['./new-session-dialog.component.scss'],
})
export class NewSessionDialogComponent implements OnInit, OnDestroy {
  constructor(
    private trainingSessionService: TrainingSessionService,
    private appStateService: AppStateService,
    public msg: AlertsApiService,
    private formBuilder: UntypedFormBuilder,
    private router: Router
  ) {}

  @Input() visible: boolean = false;
  @Input() isReusedSession: boolean = false;
  @Input() sessions: number;
  @Input() isNewSession: boolean = false;
  @Input() selectedSession: TrainingExerciseSession;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshSessionList = new EventEmitter<boolean>();
  getScreenWidth(): any {
    return screen.width;
  }

  step: number = 1;
  selectedCity: City;
  $subscriptions: Subscription = new Subscription();
  subContentOne = [
    'conduction',
    'clearance',
    'kick_with_the_foot',
    'head_hitting',
    'skill_and_dexterity',
    'interception',
  ];
  subContentTwo = ['feint', 'pass', 'relief', 'combined_actions'];
  loading: boolean = false;
  trainingSessionTypeList: TrainingSessionType[] = [];
  selectedTrainingSessionType: TrainingSessionType;
  trainingPeriodList: TrainingPeriod[] = [];
  technicianSubContentSessionOne: Target[] = [];
  technicianSubContentSessionTwo: Target[] = [];
  tacticalSubContentSessionOne: Target[] = [];
  tacticalSubContentSessionTwo: Target[] = [];
  seletecTacticalTarget: Target;
  seletecTechnicianTarget: Target;
  techniciansList: Target[] = [];
  tacticalList: Target[] = [];
  physical_preparationList: Target[] = [];
  psychosocialList: Target[] = [];
  team: any;
  user: any;
  placeInput: boolean = false;

  role: string = '';
  minDate = new Date();
  typeSessionId: number;
  newSessionForm: UntypedFormGroup;
  club: Club;
  places: SessionPlace[] = [];
  selectedPlace: number;

  closeDialog() {
    this.close.emit(false);
    this.selectedSession = {} as TrainingExerciseSession;
    this.newSessionForm.reset();
  }

  ngOnInit(): void {
    this.user = localStorage.getItem('name');
    this.team = this.appStateService.getTeam();
    this.club = this.appStateService.getClub();
    this.role = localStorage.getItem('role') as string;
    this.getTrainingSessionData();

    this.loadForm(this.selectedSession);
  }

  /**
   * places
   */
  getSessionPlaces(): void {
    this.$subscriptions = this.trainingSessionService
      .getSessionPlaces(this.club.id)
      .subscribe((res) => {
        this.places = res.data;

        if (this.places.length > 0 && this.selectedSession) {
          this.selectedPlace =
            this.selectedSession.exercise_session_execution.exercise_session_place.id;
        } else {
          this.selectedPlace = this.places[0]?.id;
        }
      });
  }

  loadForm(session: TrainingExerciseSession): void {
    let utcTime: any;
    if (!isEmpty(session) && !this.isReusedSession) {
      const utcHours = moment
        .utc(
          `${session.exercise_session_execution.date_session} ${session.exercise_session_execution.hour_session}`
        )
        .get('hours');
      const utcMinutes = moment
        .utc(
          `${session.exercise_session_execution.date_session} ${session.exercise_session_execution.hour_session}`
        )
        .get('minutes');

      utcTime = moment(session.exercise_session_execution.date_session)
        .set('hours', utcHours)
        .set('minutes', utcMinutes)
        .toDate();
    }

    this.newSessionForm = this.formBuilder.group({
      title: new UntypedFormControl(
        !isEmpty(session) ? session.title : '',
        Validators.required
      ),
      type_exercise_session_id: new UntypedFormControl(
        !isEmpty(session) ? session.type_exercise_session_id : '',
        Validators.required
      ),
      training_period: new UntypedFormControl(
        !isEmpty(session) ? session.training_period_id : false,
        Validators.required
      ),
      place_session: new UntypedFormControl(''),
      place_id: new UntypedFormControl(''),
      order: new UntypedFormControl(
        !isEmpty(session) ? session.order : this.sessions + 1,
        Validators.required
      ),
      date_session: new UntypedFormControl(
        !isEmpty(session) && utcTime ? utcTime : '',
        Validators.required
      ),
    });
  }

  /**
   * get all resources to create a training session
   */
  getTrainingSessionData(): void {
    this.$subscriptions = this.trainingSessionService
      .getTypeExerciseSession()
      .subscribe((res) => {
        if (res.success) {
          this.trainingSessionTypeList = res.data;

          if (isEmpty(this.selectedSession)) {
            this.newSessionForm
              .get('type_exercise_session_id')
              ?.setValue(res.data[0]);

            this.typeSessionId = res.data[0].id;
          } else {
            const getSelected = this.trainingSessionTypeList.filter(
              (type) =>
                type.id === this.selectedSession.type_exercise_session_id
            );

            this.typeSessionId = getSelected[0].id as number;
          }
        }
      });
    this.$subscriptions = this.trainingSessionService
      .getTypeOfTrainingPeriod()
      .subscribe((res) => {
        if (res.success) {
          this.trainingPeriodList = res.data;
        }
      });

    this.getSessionPlaces();
  }

  /**
   * technician
   * @param target
   */
  selectTechniciansTarget(target: Target): void {
    this.seletecTechnicianTarget = target;
  }

  /**
   * tactical
   * @param target
   */
  selectTacticalTarget(target: Target): void {
    this.seletecTacticalTarget = target;
  }

  /**
   * add places by text or dropdown
   */
  handlePlaces(): void {
    this.placeInput = !this.placeInput;
  }

  /**
   * submit form
   */

  onSubmit(): void {
    this.loading = true;

    const author = this.user;
    const title = this.newSessionForm.get('title')?.value;
    const training_period_id = parseInt(
      this.newSessionForm.get('training_period')?.value
    );
    const order = this.newSessionForm.get('order')?.value;

    const type_exercise_session_id = this.typeSessionId;

    let date: any;
    let execution: any;

    if (this.selectedSession) {
      const parsedDate = moment(
        this.newSessionForm.get('date_session')?.value
      ).format('DD/MM/YYYY HH:mm');

      const place = this.places.find(
        (place) => place.id === this.selectedPlace
      )?.id;

      if (parsedDate === 'Invalid date') {
        date = this.newSessionForm
          .get('date_session')
          ?.value.split(' ')[0]
          .split('/');

        execution = {
          date_session: `${date[2]}/${date[1]}/${date[0]}`,
          hour_session: this.newSessionForm
            .get('date_session')
            ?.value.split(' ')[1],
          place_session: this.newSessionForm.get('place_session')?.value,
          exercise_session_place_id: place || null,
        };

        if (place && !this.newSessionForm.get('place_session')?.value) {
          delete execution.place_session;
        } else {
          delete execution.exercise_session_place_id;
        }
      } else {
        const parseDate = moment(
          this.newSessionForm.get('date_session')?.value
        ).format('DD/MM/YYYY');

        const parseHour = moment(
          this.newSessionForm.get('date_session')?.value
        ).format('HH:mm');

        date = parseDate.split(' ')[0].split('/');

        execution = {
          date_session: `${date[2]}/${date[1]}/${date[0]}`,
          hour_session: parseHour,
          place_session: this.newSessionForm.get('place_session')?.value,
          exercise_session_place_id: place || null,
        };

        if (place && !this.newSessionForm.get('place_session')?.value) {
          delete execution.place_session;
        } else {
          delete execution.exercise_session_place_id;
        }
      }
    } else {
      date = this.newSessionForm
        .get('date_session')
        ?.value.split(' ')[0]
        .split('/');

      execution = {
        date_session: `${date[2]}/${date[1]}/${date[0]}`,
        hour_session: this.newSessionForm
          .get('date_session')
          ?.value.split(' ')[1],
        place_session: this.newSessionForm.get('place_session')?.value,
        exercise_session_place_id: this.selectedPlace,
      };

      if (this.selectedPlace) {
        delete execution.place_session;
      } else {
        delete execution.exercise_session_place_id;
      }
    }

    const trainingSession: TrainingSessionForm = {
      author,
      title,
      order,
      training_period_id,
      duration: '00:00',
      type_exercise_session_id,
      execution,
    };

    if (this.role === 'teacher') {
      delete trainingSession?.training_period_id;
      delete trainingSession?.type_exercise_session_id;
    }

    if (isEmpty(this.selectedSession)) {
      this.createSession(trainingSession);
    } else if (!isEmpty(this.selectedSession) && this.isReusedSession) {
      this.createSession(trainingSession);
    } else {
      this.updateSession(trainingSession);
    }
  }

  createSession(trainingSession: any): void {
    if (this.role === 'sport') {
      this.trainingSessionService
        .createExerciseSession(trainingSession, this.team.id)
        .subscribe(
          (res) => {
            if (res.success) {
              this.msg.succes(res.message);
              this.refreshSessionList.emit(true);

              setTimeout(() => {
                this.router.navigate([
                  `/club/training-sessions/details/${res.data.code}`,
                ]);
              }, 1000);
            }

            this.closeDialog();
            this.loading = false;
          },
          ({ error }) => {
            this.msg.error(error);

            this.loading = false;
            this.closeDialog();
          }
        );
    } else {
      this.trainingSessionService
        .createClassroomExerciseSession(trainingSession, this.team.id)
        .subscribe(
          (res) => {
            if (res.success) {
              this.msg.succes(res.message);
              this.refreshSessionList.emit(true);

              setTimeout(() => {
                this.router.navigate([
                  `/club/training-sessions/details/${res.data.code}`,
                ]);
              }, 1000);
            }

            this.closeDialog();
            this.loading = false;
          },
          ({ error }) => {
            this.msg.error(error);

            this.loading = false;
            this.closeDialog();
          }
        );
    }
  }

  updateSession(trainingSession: any): void {
    trainingSession.code = this.selectedSession.code;

    this.trainingSessionService
      .updateExerciseSession(trainingSession, this.team.id, this.role)
      .subscribe(
        (res) => {
          if (res.success) {
            this.msg.succes(res.message);
            this.refreshSessionList.emit(true);
          }

          this.closeDialog();
          this.loading = false;
        },
        ({ error }) => {
          this.msg.error(error);

          this.loading = false;
          this.closeDialog();
        }
      );
  }

  checkSelectedSession(): boolean {
    return !isEmpty(this.selectedSession);
  }

  ngOnDestroy(): void {
    if (this.$subscriptions) this.$subscriptions.unsubscribe();
  }
}
