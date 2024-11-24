import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { CompetitionService } from '../../../../_services/competitions.service';
import * as moment from 'moment';
import { Competition, CompetitionType } from 'src/app/_models/competition';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { fileToBase64 } from 'src/app/utils/base64Converter';

@Component({
  selector: 'crear-competicion-dialog',
  templateUrl: './crear-competicion-dialog.component.html',
  styleUrls: ['./crear-competicion-dialog.component.scss'],
})
export class CrearCompeticionDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() selectedCompetition: Competition | null;
  @Output() close = new EventEmitter<boolean>();
  @Output() refreshCompetitions = new EventEmitter<boolean>();
  competitionForm: UntypedFormGroup;
  team: ITeam;
  team_list: any[] = [];
  competition_image_name: string;
  team_image_name: string;
  step: number = 1;
  selectedValue: any;
  fecha!: any;
  loading: boolean = false;
  minDate = new Date();
  showUpdateImagen: boolean = false;
  urlBase = environment.images;
  competitionTypes: CompetitionType[] = [];
  subs$ = new Subscription();
  oneStepSports: string[] = ['swimming', 'tennis', 'padel', 'badminton'];
  submited: boolean = false;
  teamImgPrev: any = '';
  teamRivalImgPrev: any = '';
  openCropperDialog: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private competitionService: CompetitionService,
    private appStateService: AppStateService,
    public msg: AlertsApiService,
    private formBuilder: UntypedFormBuilder
  ) {}

  /**
   * g
   */
  get teams(): UntypedFormArray | any {
    return this.competitionForm.get('teams') as UntypedFormArray;
  }

  /**
   * form controls
   */
  get f() {
    return this.competitionForm.controls;
  }

  get getLabel(): string {
    return this.step === 2
      ? 'competition.competition_dialog.register_rival_team'
      : this.team?.sport?.code !== 'swimming'
      ? 'competition.create_competition'
      : 'competition.create_proof';
  }

  get getLabelName(): string {
    return this.team?.sport?.code !== 'swimming'
      ? 'competition.competition_dialog.competition_name'
      : 'competition.competition_dialog.proof_name';
  }

  getScreenWidth(): any {
    return screen.width;
  }

  closeDialog() {
    this.close.emit(false);
    this.selectedCompetition = null;
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.loadForm(this.selectedCompetition);
    if (this.selectedCompetition) {
      this.showUpdateImagen = true;
    }
    this.getCompetitionTypes();
  }

  /**
   * load competition form
   */
  loadForm(data: Competition | null): void {
    this.competitionForm = this.formBuilder.group({
      name: new UntypedFormControl(data ? data.name : '', Validators.required),
      image: new UntypedFormControl(''),
      competition_type: new UntypedFormControl(
        data ? data.type_competition_id : '',
        Validators.required
      ),
      date: new UntypedFormControl(
        data ? [new Date(data.date_start), new Date(data.date_end)] : '',
        Validators.required
      ),
      team_name: new UntypedFormControl(''),
      team_image: new UntypedFormControl(''),
      team_image_preview: new UntypedFormControl(''),
      teams: new UntypedFormArray([], Validators.required),
    });
    if (data) {
      this.loadRivals(data);
    }
  }

  /**
   * load rival list
   */
  loadRivals(data: Competition): void {
    let rivals: any = data.rivals?.map((rival) => ({
      name: rival.rival_team,
      image_file: rival.url_image,
      image_preview: rival.url_image,
      id: rival.id,
    }));
    this.team_list = [...rivals];

    rivals.forEach((rival: any) => {
      const team = new UntypedFormGroup({
        name: new UntypedFormControl(rival.name),
        image_file: new UntypedFormControl(rival.image_file),
        image_preview: new UntypedFormControl(rival.image_preview),
      });
      this.teams.push(team);
    });
  }

  /**
   * get competition types
   */
  getCompetitionTypes(): void {
    this.subs$ = this.competitionService
      .getCompetitionType(this.team.sport.code)
      .subscribe((res) => {
        this.competitionTypes = res.data;
      });
  }

  getImage(file: File): void {
    this.readURL(file, this.step === 1 ? 'competition' : 'team');
  }

  /**
   * read competition and rival image urls
   * @param event
   * @param type
   */
  readURL(file: File, type: string): void {
    if (file) {
      const reader = new FileReader();
      if (type === 'team') {
        reader.onload = (e) => {
          this.competitionForm.get('team_image')?.setValue(file);
          this.competitionForm
            .get('team_image_preview')
            ?.setValue(reader.result);
        };
        this.teamRivalImgPrev = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );
        this.team_image_name = file?.name;
      } else {
        reader.onload = (e) =>
          this.competitionForm.get('image')?.setValue(file);
        this.competition_image_name = file?.name;
        this.teamImgPrev = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );
      }
      reader.readAsDataURL(file);

      this.openCropperDialog = false;
    }
  }

  /**
   * Add every team to the form
   */
  addTeam(): void {
    if (!this.selectedCompetition) {
      const team = this.getTeam();
      this.teams.push(team);
      this.team_list = this.competitionForm.get('teams')?.value;
      this.resetRival();
    } else {
      const formData = new FormData();
      formData.append(
        'competition_id',
        JSON.stringify(this.selectedCompetition.id)
      );
      formData.append('name', this.competitionForm.get('team_name')?.value);
      if (this.competitionForm.get('team_image')?.value)
        formData.append('image', this.competitionForm.get('team_image')?.value);

      this.competitionService.addRivalTeamByCompetition(formData).then(
        (teamRes: any) => {
          this.resetList();
        },
        (error) => {
          const parseError = JSON.parse(error);
          this.msg.error(parseError);
          this.loading = false;
        }
      );
    }
  }

  /**
   * get team data from form
   */
  getTeam(): any {
    const team = new UntypedFormGroup({
      name: new UntypedFormControl(
        this.competitionForm.get('team_name')?.value
      ),
      image_file: new UntypedFormControl(
        this.competitionForm.get('team_image')?.value
      ),
      image_preview: new UntypedFormControl(
        this.competitionForm.get('team_image_preview')?.value
      ),
    });
    return team;
  }

  /**
   * Delete a team
   * @param index
   */
  deleteTeam(index: number): void {
    if (!this.selectedCompetition) {
      this.team_list = this.team_list.filter((item, i) => i !== index);
      this.teams.removeAt(index);
    } else {
      this.competitionService.deleteRival(index).subscribe(
        (res) => {
          this.team_list = this.team_list.filter((team) => team.id !== index);
          if (this.team_list.length === 0) {
            this.teams.removeAt(0);
          }
          this.resetList();
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
    }
  }

  /**
   * Submit competition
   */
  onSubmit(): any {
    if (this.step === 1) {
      this.submited = true;
      if (
        this.f['name'].status === 'VALID' &&
        this.f['competition_type'].status === 'VALID' &&
        this.f['date'].status === 'VALID'
      ) {
        this.submited = false;
        if (this.oneStepSports.includes(this.team.sport.code)) {
          this.submitData();
        } else {
          this.step = 2;
        }
      }
      return;
    }

    if (this.step === 2) {
      this.submitData();
    }
  }

  submitData(): void {
    let rival_names: any[] = [];
    this.loading = true;
    const competitionData = {
      name: this.competitionForm.get('name')?.value,
      type_competition_id: parseInt(
        this.competitionForm.get('competition_type')?.value
      ),
      date_start: moment(this.competitionForm.get('date')?.value[0]).format(
        'YYYY-MM-DD'
      ),
      date_end: moment(this.competitionForm.get('date')?.value[1]).format(
        'YYYY-MM-DD'
      ),
      team_id: this.team.id,
      image: this.competitionForm.get('image')?.value,
    };

    if (!this.oneStepSports.includes(this.team.sport.code)) {
      this.competitionForm
        .get('teams')
        ?.value.forEach(async (rivalItem: any, i: number) => {
          if (rivalItem.image_file) {
            try {
              const base64String = await fileToBase64(rivalItem.image_file);

              rival_names.push({
                name: rivalItem.name,
                image: base64String,
              });
            } catch (error) {
              console.error('Error al leer el archivo:', error);
            }
          } else {
            rival_names.push({
              name: rivalItem.name,
            });
          }
        });
    }

    if (this.selectedCompetition) {
      this.competitionService
        .updateCompetition(competitionData, this.selectedCompetition.id)
        .then((res: any) => {
          const parseResponse = JSON.parse(res);
          this.msg.succes(parseResponse.message);
          this.loading = false;
          this.close.emit(false);
          this.refreshCompetitions.emit(true);
          this.competitionForm.reset();
        })
        .catch((error) => {
          const parseError = JSON.parse(error);

          this.msg.error(parseError);
          this.loading = false;
        });
    } else {
      if (!this.oneStepSports.includes(this.team.sport.code)) {
        this.competitionService
          .createCompetition(competitionData)
          .then((res: any) => this.competitionData(res, rival_names))
          .catch((error) => {
            const parseError = JSON.parse(error);

            this.msg.error(parseError);
            this.loading = false;
          });
      } else {
        this.competitionService
          .createCompetition(competitionData)
          .then((res: any) => this.clearCompetitionFormData(res.message))
          .catch((error) => {
            const parseError = JSON.parse(error);
            this.msg.error(parseError);
            this.loading = false;
          });
      }
    }
  }

  /**
   * competition created info
   */
  competitionData(resCompetition: any, rival_teams: any[]): void {
    const parseResponse = JSON.parse(resCompetition);

    if (parseResponse.success) {
      this.competitionService
        .createRivalTeams({
          competition_id: this.selectedCompetition
            ? this.selectedCompetition.id
            : parseResponse.data.id,
          rival_teams,
        })
        .subscribe(
          (res) => {
            this.clearCompetitionFormData(parseResponse.message);
          },
          ({ error }) => {
            console.log(error);
            this.msg.error(error);
            this.loading = false;
          }
        );
    }
  }

  /**
   * clear data
   */
  clearCompetitionFormData(message: string): void {
    this.msg.succes(message);
    this.loading = false;
    this.close.emit(false);
    this.team_image_name = '';
    this.competition_image_name = '';
    this.refreshCompetitions.emit(true);
    this.competitionForm.reset();
    this.team_list = [];
    this.step = 1;
  }

  /**
   * reset rival List
   */
  resetList(): void {
    this.competitionService
      .getRivalTeamsByCompetitionId(this.selectedCompetition?.id as number)
      .subscribe(
        (res) => {
          const rivals = res.data;
          this.loadRivals({
            rivals,
            name: '',
            created_at: '',
            type_competition_id: 0,
            type_competition_name: '',
            date_start: '',
            date_end: '',
            image: undefined,
            url_image: '',
            teams: [],
            matches: [],
          });
          this.resetRival();
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  /**
   * reset rival form data
   */
  resetRival(): void {
    this.competitionForm.get('team_name')?.setValue('');
    this.competitionForm.get('team_image_preview')?.setValue('');
    this.competitionForm.get('team_image')?.setValue('');
    this.team_image_name = '';
    this.teamRivalImgPrev = '';
  }
}
