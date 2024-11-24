import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Match, TestCategory } from 'src/app/_models/competition';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { PlayersService } from 'src/app/_services/players.service';

import * as moment from 'moment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Player } from 'src/app/_models/player';
import { ITeam } from 'src/app/_models/ITeam.interface';

@Component({
  selector: 'app-one-step-dialog',
  templateUrl: './one-step-dialog.component.html',
  styleUrls: ['../create-match-dialog.component.scss'],
})
export class OneStepDialogComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() match: Match;
  @Output() close = new EventEmitter<boolean>();
  @Input() matchDate: any;
  @Output() refreshMatchList = new EventEmitter<boolean>();
  step: number = 1;
  team: ITeam;
  competitionId: string;
  loadingLastMatch: boolean = false;
  players: Player[] = [];
  testList: TestCategory[] = [];
  testTypeList: TestCategory[] = [];
  rivalList: { name: string }[] = [];
  loading: boolean = false;
  date = new Date();
  minDate = new Date();
  isAvailableMatch: boolean = true;
  sportCode: string;
  tennisFormFields: string[] = ['tennis', 'badminton', 'padel'];
  modalities: { name: string; code: string; id: number }[] = [];
  dialogTitle: string = 'new_test';
  seletectPlayers: { label: string; value: string }[] = [];
  $subscription: Subscription;
  isSubmit: boolean = false;
  matchForm: UntypedFormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private competitionService: CompetitionService,
    private appStateService: AppStateService,
    public msg: AlertsApiService,
    private playerService: PlayersService
  ) {
    this.team = this.appStateService.getTeam();
  }

  /**
   * get rivals form control
   */
  get rivals(): UntypedFormArray | any {
    return this.matchForm.get('rivals') as UntypedFormArray;
  }

  getScreenWidth(): any {
    return screen.width;
  }

  ngOnInit(): void {
    this.competitionId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    this.loadForm();
    if (this.tennisFormFields.includes(this.team.sport.code)) {
      this.dialogTitle = 'new_match';
    }
    this.getPlayers();
    this.getTestCategories();
    this.sportModality();
  }

  /**
   * get sport modality
   */
  sportModality(): void {
    this.$subscription = this.competitionService
      .getCompetitionModality(this.team.sport.code)
      .subscribe((res) => {
        this.modalities = res.data;
        if (!!this.match) {
          const modality = this.modalities.find(
            (modality) => modality.id === this.match.modality_id
          );
          if (!!modality) {
            this.matchForm.get('modality_id')?.setValue(modality.code);
          }
        }
      });
  }

  loadForm(): void {
    const swimmingValidator = this.team.sport.code === 'swimming';
    this.matchForm = new UntypedFormGroup({
      start_at: new UntypedFormControl(
        !!this.match
          ? new Date(moment(this.match.start_at).format('MM-DD-YYYY'))
          : new Date(),
        Validators.required
      ),
      location: new UntypedFormControl(!!this.match ? this.match.location : ''),
      players: new UntypedFormControl([], Validators.required),
      test_category_id: new UntypedFormControl(
        !!this.match ? this.match.test_category_id : '',
        swimmingValidator ? Validators.required : null
      ),
      test_type_category_id: new UntypedFormControl(
        !!this.match ? this.match.test_type_category_id : ''
      ),
      observation: new UntypedFormControl(
        !!this.match ? this.match.observation : ''
      ),
      rival_name: new UntypedFormControl(''),
      rivals: new UntypedFormArray([]),
      modality_id: new UntypedFormControl(
        swimmingValidator ? '' : 'individual',
        swimmingValidator ? null : Validators.required
      ),
    });
    if (this.match?.rivals.length > 0) {
      this.rivalList = this.match.rivals.map((item) => ({
        name: item.rival_player,
      }));
    }
  }

  /**
   * get rival
   */
  getRivalName(): any {
    return new UntypedFormGroup({
      name: new UntypedFormControl(this.matchForm.get('rival_name')?.value),
    });
  }

  /**
   * handleReferee
   */
  addRival(): void {
    const team = this.getRivalName();
    this.rivals.push(team);
    if (this.match?.rivals.length > 0) {
      this.rivalList = [
        ...this.rivalList,
        ...this.matchForm.get('rivals')?.value,
      ];
    } else {
      this.rivalList = this.matchForm.get('rivals')?.value;
    }
    this.matchForm.get('rival_name')?.setValue('');
    if (this.checkSimilarSports()) {
      this.handleModality(this.matchForm.get('modality')?.value);
    }
  }

  /**
   * Delete a team
   * @param index
   */
  deleteRival(index: number): void {
    this.rivalList = this.rivalList.filter((item, i) => i !== index);
    this.rivals.removeAt(index);
    if (
      this.rivalList.length === 1 &&
      this.matchForm.get('modality')?.value === 'individual'
    ) {
      this.matchForm.get('rival_name')?.disable();
    } else {
      this.matchForm.get('rival_name')?.enable();
    }
  }

  /**
   * handle tennis modality
   */
  handleModality(modalityValue: number | string): void {
    if (this.rivalList.length === 1 && modalityValue === 'individual') {
      this.matchForm.get('rival_name')?.disable();
    } else if (this.rivalList.length === 1 && modalityValue === 'double') {
      this.matchForm.get('rival_name')?.enable();
    }
    if (
      (this.rivalList.length === 2 && modalityValue === 'double') ||
      (this.rivalList.length === 2 && modalityValue === 'individual')
    ) {
      this.matchForm.get('rival_name')?.disable();
    } else if (this.rivalList.length === 1 && modalityValue === 'double') {
      this.matchForm.get('rival_name')?.enable();
    }
  }

  /**
   * get players by team
   */
  getPlayers(): void {
    this.$subscription = this.playerService
      .getAllPlayersByTeam(this.team.id)
      .subscribe((res) => {
        if (res.success) {
          this.players = res.data.map((item: Player) => ({
            label: item.full_name,
            value: item.id,
          }));
          if (!!this.match) {
            this.seletectPlayers = this.match.players.map(
              (item: { player: any }) => ({
                label: item.player.full_name,
                value: item.player.id,
              })
            );
          }
        } else {
          this.players = [];
        }
      });
  }

  /**
   * get categories
   */
  getTestCategories(): void {
    this.$subscription = this.competitionService
      .getTestCategories()
      .subscribe((res) => {
        if (res.success) {
          this.testList = res.data.map((item: TestCategory) => ({
            label: item.name,
            value: item.id,
            id: item.id,
            code: item.code,
          }));
        } else {
          this.testList = [];
        }
      });
  }

  /**
   * get type categories
   */
  getTestTypeCategories(id: string): void {
    const findCategory = this.testList.find((test) => test.id === id);
    if (!!findCategory) {
      this.$subscription = this.competitionService
        .getTestTypeCategories(findCategory.code)
        .subscribe((res) => {
          if (res.success) {
            this.testTypeList = res.data.test_type_category.map(
              (item: TestCategory) => ({
                label: item.type,
                value: item.id,
              })
            );
          } else {
            this.testTypeList = [];
          }
        });
    }
  }

  /**
   * verify match date
   */
  verifyMatchDate(date: Date): void {
    const formatDate = moment(date).format('YYYY-MM-DD HH:mm');
    this.$subscription = this.competitionService
      .verifyMatches(this.team.id, formatDate, +this.competitionId)
      .subscribe(
        (res) => {
          this.isAvailableMatch = !res.data.hasMatches;
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.isSubmit = true;
    if (this.matchForm.status === 'INVALID') {
      return;
    }
    this.isSubmit = false;
    this.loading = true;
    let match: Match = {
      ...this.matchForm.value,
      start_at: moment(this.matchForm.get('start_at')?.value).format(
        'YYYY-MM-DDTHH:mm:ss'
      ),
      team_id: this.team.id,
      competition_id: parseInt(this.competitionId),
      rivals: this.rivalList.map((rival) => rival.name),
      players: this.seletectPlayers.map((player) => player.value),
    };
    if (this.checkSimilarSports()) {
      match = {
        ...match,
        modality_id: this.modalities.find(
          (modality) =>
            modality.code === this.matchForm.get('modality_id')?.value
        )?.id as number,
      };
    }
    if (this.team.sport.code === 'swimming') {
      delete match.modality_id;
    }
    delete match.rival_name;
    if (!!this.match) {
      this.handleEditMatchForm(match, this.team.id, this.match.id as number);
    } else {
      this.handleCreateMatchForm(match);
    }
  }

  /**
   * create match
   * @param match
   */
  handleCreateMatchForm(match: Match): void {
    this.competitionService.createMatchCompetition(match).subscribe(
      (res) => {
        if (res.success) {
          this.msg.succes(res.message);
          this.loading = false;
          this.refreshMatchList.emit(true);
          this.closeDialog();
        }
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * edit match
   * @param match
   * @param teamId
   */
  handleEditMatchForm(match: Match, teamId: number, matchId: number): void {
    this.competitionService
      .editMatchCompetition(match, teamId, matchId)
      .subscribe(
        (res) => {
          if (res.success) {
            this.msg.succes(res.message);
            this.loading = false;
            this.refreshMatchList.emit(true);
            this.closeDialog();
          }
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
  }

  /**
   * check sport similar tennis
   */
  checkSimilarSports(): boolean {
    return this.tennisFormFields.includes(this.team.sport.code);
  }

  closeDialog(): void {
    this.close.emit(true);
  }
}
