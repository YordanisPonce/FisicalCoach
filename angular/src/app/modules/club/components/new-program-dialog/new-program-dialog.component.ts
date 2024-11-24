import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { InjuryPreventionService } from 'src/app/_services/injury-prevention.service';
import { GeneralService } from 'src/app/_services/general.service';
import { TeamService } from 'src/app/_services/team.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
// import { PlayersService } from 'src/app/_services/players.service';
import { InjuryService } from 'src/app/_services/injury.service';
import FieldsValidation from 'src/app/utils/FieldsValidation';
import { resourcesUrl } from 'src/app/utils/resources';

@Component({
  selector: 'new-program-dialog',
  templateUrl: './new-program-dialog.component.html',
  styleUrls: ['./new-program-dialog.component.scss'],
})
export class NewProgramDialogComponent implements OnInit {
  constructor(
    private formBuilder: UntypedFormBuilder,
    private injuryPreventionService: InjuryPreventionService,
    private generalService: GeneralService,
    private teamService: TeamService,
    private appStateQuery: AppStateQuery,
    private translate: TranslateService,
    // private playersService: PlayersService
    private injuryService: InjuryService
  ) {}

  validation: any = new FieldsValidation();

  newProgramForm = this.formBuilder.group({
    title: ['', Validators.required],
    detailed_location: [''],
    description: ['', Validators.required],
    team_staff_id: ['', Validators.required],
    preventive_program_type_id: ['', Validators.required],
    // other_preventive_program_type:['',Validators.required],
    injury_location_id: ['', Validators.required],
    week_days: ['', Validators.required],
  });

  loading: boolean = false;
  submittedForm: boolean = false;
  resources = resourcesUrl;

  step: number = 1;
  @Input() visible: boolean = false;
  @Input() selectedPlayer: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() createdProgram = new EventEmitter<any>();

  programTypes: any;
  weekDays: any;
  teamStaff: any;
  injuriesLocation: any;

  otherProgramType: boolean = false;

  get newProgramControls() {
    return this.newProgramForm.controls;
  }

  getDayLetter(day: string, code: string): string {
    const LETTER = day.charAt(0).toUpperCase();

    if (code === 'tuesday') return 'X';

    return LETTER;
  }

  closeDialog() {
    // this.advancedDialog = false
    if (this.otherProgramType) {
      this.otherProgramType = false;
      this.newProgramForm.removeControl('other_preventive_program_type');
    }
    this.close.emit(false);
    this.step = 1;
  }

  getTeamId(): string {
    let clubCode: string = '';
    this.appStateQuery.team$.subscribe((res) => {
      clubCode = res.id;
    });
    return clubCode;
  }

  selectedDaysCount() {
    const WEEK_DAYS = this.newProgramControls.week_days.value;
    return WEEK_DAYS.length;
  }

  validateStep() {
    let fields = [];
    switch (this.step) {
      case 1:
        fields = ['title', 'team_staff_id', 'week_days'];
        if (!this.validation.validateStepFields(fields, this.newProgramForm))
          this.step = this.step + 1;
        break;
      case 2:
        if (this.otherProgramType) {
          fields = [
            'preventive_program_type_id',
            'other_preventive_program_type',
            'injury_location_id',
          ];
        } else {
          fields = ['preventive_program_type_id', 'injury_location_id'];
        }
        if (!this.validation.validateStepFields(fields, this.newProgramForm))
          this.step = this.step + 1;
        break;
      case 3:
        fields = ['description'];
        if (!this.validation.validateStepFields(fields, this.newProgramForm))
          this.step = this.step + 1;
        break;
      default:
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(this.selectedPlayer)
    if (this.selectedPlayer != null) {
      // console.log(this.selectedPlayer)
      // this.teams.push(this.newTeam)
    }
  }

  setProgramType(data: any) {
    // console.log(data)
    this.newProgramForm.patchValue({ preventive_program_type_id: data.id });
    if (data.code === 'others') {
      this.newProgramForm.addControl(
        'other_preventive_program_type',
        new UntypedFormControl('', Validators.required)
      );
      this.otherProgramType = true;
    } else {
      this.otherProgramType = false;
      this.newProgramForm.removeControl('other_preventive_program_type');
    }
    // console.log(this.newProgramForm.value)
  }

  onSubmit(event: any): void {
    event.preventDefault();
    // console.warn(this.newProgramForm.value)
    this.submittedForm = true;
    if (this.newProgramForm.invalid) {
      return;
    } else {
      this.loading = true;
      this.injuryPreventionService
        .createNewProgram(
          this.newProgramForm.value,
          this.selectedPlayer.team_id,
          this.selectedPlayer.player_id
        )
        .subscribe((res: any) => {
          // console.log(res)
          // const response = JSON.parse(res)
          this.createdProgram.emit(res.data);
          this.newProgramForm.reset();
          this.step = 4;
          this.loading = this.submittedForm = false;
        });
    }
  }

  ngOnInit(): void {
    this.injuryPreventionService
      .getPreventiveProgramTypes()
      .subscribe((data: any) => {
        // console.log(data)
        this.programTypes = data.data;
      });

    this.generalService.getWeekDays().subscribe((data: any) => {
      // console.log(data)
      this.weekDays = data.data;
    });

    this.teamService.getStaffByTeam(this.getTeamId()).subscribe((data: any) => {
      // console.log(data)
      this.teamStaff = data.data;
    });

    this.injuryService.getListInjuryLocations().subscribe((data: any) => {
      // console.log(data)
      this.injuriesLocation = data.data;
    });
  }
}
