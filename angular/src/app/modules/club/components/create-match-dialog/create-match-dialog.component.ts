import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Match, RivalTeam, TypePlayer } from 'src/app/_models/competition';
import { Player } from 'src/app/_models/player';
import { TypeLineUps } from 'src/app/_models/team';
import { Weather } from 'src/app/_models/weather';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { GeneralService } from 'src/app/_services/general.service';
import { PlayersService } from 'src/app/_services/players.service';
import { TeamService } from 'src/app/_services/team.service';

import * as moment from 'moment';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { TranslateService } from '@ngx-translate/core';
import { Referee } from 'src/app/_models/referee';
import { ITeam } from 'src/app/_models/ITeam.interface';
@Component({
  selector: 'create-match-dialog',
  templateUrl: './create-match-dialog.component.html',
  styleUrls: ['./create-match-dialog.component.scss'],
})
export class CreateMatchDialogComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private competitionService: CompetitionService,
    private generalService: GeneralService,
    private teamService: TeamService,
    private playerService: PlayersService,
    private appStateService: AppStateService,
    public msg: AlertsApiService,
    private translate: TranslateService
  ) {
    this.team = this.appStateService.getTeam();
  }

  @Input() visible: boolean = false;
  @Input() match: Match;
  @Input() matchDate: any;
  @Output() close = new EventEmitter<boolean>();
  @Output() loadignPlayers = new EventEmitter<boolean>();
  @Output() refreshMatchList = new EventEmitter<boolean>();

  step: number = 1;

  team: ITeam;

  competitionId: string;
  loadingLastMatch: boolean = false;
  rivalTeams: RivalTeam[] = [];
  selectedTeam: RivalTeam;
  weatherList: Weather[] = [];
  refereeList: Referee[] = [];
  LineUpTypeList: TypeLineUps[] = [];
  selectedTypeLineup: TypeLineUps;
  players: any[] = [];
  loadingPlayers: boolean = false;
  selectedTeamType: any = {};
  selectedPlayerList: any[] = [];
  loading: boolean = false;
  date = new Date();
  minDate = new Date();
  isAvailableMatch: boolean = true;
  sportCode: string;
  typePlayers: TypePlayer[] = [];
  selectedCode: string;
  selectedType: any;
  refereeInput: boolean = false;
  oneStepSports: string[] = ['swimming', 'tennis', 'badminton', 'padel'];
  sportModality: { code: string; id: number };
  modalities: { name: string; code: string; id: number }[] = [];

  $subscription: Subscription;

  matchForm: UntypedFormGroup;
  getScreenWidth(): any {
    return screen.width;
  }

  closeDialog() {
    this.close.emit(false);
    this.matchForm.reset();
    this.selectedPlayerList = [];
    this.players = this.players.map((player) => {
      delete player.type_player_id;

      return player;
    });
    this.step = 1;
  }

  ngOnInit(): void {
    this.competitionId = this.activatedRoute.snapshot.paramMap.get('id') || '';
    const id = this.team.id;

    if (!this.oneStepSports.includes(this.team.sport.code)) {
      this.getRivalTeamsByCompetitionId(this.competitionId);
      this.getModality();
      this.getRefereeList();
    }

    this.getWeatherList();
    this.getAllPlayersByTeam(id);
    this.sportTypeModality();

    this.loadForm();
  }

  loadForm(): void {
    this.matchForm = new UntypedFormGroup({
      start_at: new UntypedFormControl(
        !!this.match
          ? new Date(moment(this.match.start_at).format('MM-DD-YYYY'))
          : new Date(),
        Validators.required
      ),
      location: new UntypedFormControl(!!this.match ? this.match.location : ''),
      competition_rival_team_id: new UntypedFormControl(
        !!this.match ? this.match.competition_rival_team_id : '',
        Validators.required
      ),
      match_situation: new UntypedFormControl(
        !!this.match ? this.match.match_situation : '',
        Validators.required
      ),
      referee_id: new UntypedFormControl(!!this.match ? this.match.referee_id : ''),
      referee_name: new UntypedFormControl(''),
      weather_id: new UntypedFormControl(!!this.match ? this.match.weather_id : ''),
      modality_id: new UntypedFormControl(!!this.match ? this.match.modality_id : ''),
    });
  }

  /**
   * get sport modality
   */
  sportTypeModality(): void {
    this.$subscription = this.competitionService
      .getCompetitionModality(this.team.sport.code)
      .subscribe((res) => {
        this.modalities = res.data;

        if (!this.match && this.modalities.length > 0)
          this.matchForm.get('modality_id')?.setValue(this.modalities[0].id);
      });
  }

  /**
   * get type players
   */
  getTypePlayers(players: Player[] = []): void {
    this.$subscription = this.playerService
      .getTypePlayers(this.team.sport?.code)
      .subscribe((res) => {
        let types = {};

        res.data.forEach((type: TypePlayer) => {
          types = { ...types, [type.code]: false };
        });

        this.selectedTeamType = types;
        if (res.data.length <= 3) {
          this.typePlayers = res.data;
        } else {
          this.typePlayers = res.data.map((type: TypePlayer) => ({
            label: type.name,
            value: type.code,
            color: type.color,
            code: type.code,
            id: type.id,
          }));
          this.selectedCode = '';
        }

        if (players.length > 0) {
          this.players = this.players.map((player) => {
            const hasType = this.typePlayers.find(
              (type) => type.id === player.type_player_id
            );

            if (hasType) {
              return {
                ...player,
                type_player_color: hasType.color,
                type_player_code: hasType.code,
              };
            }

            return {
              ...player,
            };
          });
        }
      });
  }

  /**
   * get rival teams by competition
   * @param id
   */
  getRivalTeamsByCompetitionId(id: string): void {
    const competitionId = parseInt(id);
    this.$subscription = this.competitionService
      .getRivalTeamsByCompetitionId(competitionId)
      .subscribe((res) => {
        if (res.success) {
          this.rivalTeams = res.data.map(
            (item: { rival_team: string; id: number }) => ({
              label: item.rival_team,
              value: item.id,
            })
          );
        } else {
          this.rivalTeams;
        }
      });
  }

  /**
   * get weathers
   */
  getWeatherList(): void {
    this.$subscription = this.generalService
      .getWeatherList()
      .subscribe((res) => {
        if (res.success) {
          this.weatherList = res.data.map(
            (item: { name: string; id: number }) => ({
              label: item.name,
              value: item.id,
            })
          );
        } else {
          this.weatherList = [];
        }
      });
  }

  /**
   * get referees
   */
  getRefereeList(): void {
    this.$subscription = this.competitionService
      .getRefereeListByTeamId(this.team.id)
      .subscribe(
        (res) => {
          this.refereeList = res.data.map(
            (item: { name: string; id: number }) => ({
              label: item.name,
              value: item.id,
            })
          );
        },
        (error) => {}
      );
  }

  /**
   * get type lineup by sport and modality
   */
  getModality(): void {
    this.$subscription = this.teamService
      .getTeamsModality(this.team.sport.code)
      .subscribe((res) => {
        if (res.success) {
          this.sportModality = res.data.find(
            (modality: { id: number }) => modality.id === this.team.modality_id
          );

          this.teamService
            .getTypeLineupsBySportAndModality(
              this.team.sport.code,
              this.sportModality?.code || null
            )
            .subscribe((typeRes) => {
              if (typeRes.data.length > 0) {
                this.LineUpTypeList = typeRes.data;

                this.selectedTypeLineup = typeRes.data[0];
              }
            });
        } else {
          this.LineUpTypeList = [];
        }
      });
  }

  /**
   * Get players
   */
  getAllPlayersByTeam(id: number): void {
    this.$subscription = this.playerService.getAllPlayersByTeam(id).subscribe(
      (res) => {
        if (res.success) {
          this.players = res.data;

          if (this.match && this.match.players.length > 0) {
            const selectedPlayers = this.players.map((player) => {
              const selected = this.match.players.find(
                (matchPlayer: { player_id: number }) =>
                  matchPlayer.player_id === player.id
              );

              if (selected) {
                return {
                  ...player,
                  type_player_id: selected.lineup_player_type_id,
                };
              }

              return {
                ...player,
              };
            });

            this.players = selectedPlayers;

            this.selectedPlayerList = [
              ...this.selectedPlayerList,
              ...selectedPlayers,
            ];
          }

          this.getTypePlayers(this.players);
        } else {
          this.players = [];
        }
      },
      (error) => {}
    );
  }

  selectTeamType(type: string): void {
    if (this.selectedTeamType[type] === true) {
      // this.selectedTeamType[type] = false
    } else {
      this.selectedCode = type;
      Object.keys(this.selectedTeamType).forEach((keyType) => {
        if (keyType === type) {
          this.selectedTeamType[type] = true;
        } else {
          this.selectedTeamType[keyType] = false;
        }
      });
    }
  }

  /**
   * Select player types
   * @param player
   */
  selectPlayers(player: Player): void {
    if (Object.values(this.selectedTeamType).some((isSelected) => isSelected)) {
      // player type id
      const type_player = this.typePlayers.find(
        (type) => type.code === this.selectedCode
      );

      const playerWithType = Object.assign({
        ...player,
        type_player_id: type_player?.id,
        type_player_color: type_player?.color,
        type_player_code: type_player?.code,
      });

      const findPlayer = this.selectedPlayerList.find(
        (item) => item.id === playerWithType.id
      );

      if (findPlayer) {
        this.selectedPlayerList = this.selectedPlayerList.filter(
          (item) => item.id !== playerWithType.id
        );

        const updateList = this.players.map((item: Player) => {
          if (item.id === playerWithType.id) {
            return {
              ...item,
              type_player_id: null,
              type_player_color: null,
              type_player_code: null,
            };
          }
          return {
            ...item,
          };
        });

        this.players = updateList;
      } else {
        let updateList = [];

        const findCaptain = this.players.find(
          (captain) => captain.type_player_code === 'team_captain'
        );

        if (findCaptain?.id && this.selectedCode === 'team_captain') {
          updateList = this.players.map((item: Player) => {
            if (item.id === findCaptain.id) {
              return {
                ...item,
                type_player_id: null,
                type_player_color: null,
                type_player_code: null,
              };
            }
            if (item.id === playerWithType.id) {
              return {
                ...item,
                type_player_id: type_player?.id,
                type_player_color: type_player?.color,
                type_player_code: type_player?.code,
              };
            }
            return {
              ...item,
            };
          });

          this.players = updateList;
          this.selectedPlayerList = this.selectedPlayerList.filter(
            (playerWithType) => playerWithType.id !== findCaptain.id
          );
          this.selectedPlayerList = [
            ...this.selectedPlayerList,
            playerWithType,
          ];

          return;
        }
        updateList = this.players.map((item: Player) => {
          if (item.id === playerWithType.id) {
            return {
              ...item,
              type_player_id: type_player?.id,
              type_player_color: type_player?.color,
              type_player_code: type_player?.code,
            };
          }
          return {
            ...item,
          };
        });

        this.players = updateList;
        this.selectedPlayerList = [...this.selectedPlayerList, playerWithType];
      }
    }
  }

  /**
   * get last match line up and players
   */
  getLastMatchLineupAndPlayers(): void {
    this.loadingLastMatch = true;

    this.competitionService
      .getLastMatchLineupByCompetition(this.competitionId as unknown as number)
      .subscribe(
        (res) => {
          if (res.data) {
            const lineUp = this.LineUpTypeList.find(
              (item) => item.id === res.data.type_lineup_id
            );

            if (lineUp) {
              this.selectedTypeLineup = lineUp;
            }

            this.competitionService
              .getLastMatchPlayersByCompetition(
                this.competitionId as unknown as number
              )
              .subscribe(
                (res) => {
                  if (res.success && res.data.length > 0) {
                    const lineupPlayers = res.data.map(
                      (item: any, i: number) => {
                        delete item.competititon_match_id;

                        return {
                          full_name: this.players[i].full_name,
                          position: { id: this.players[i].position?.id },
                          type_player_id: item.lineup_player_type_id,
                          ...item,
                        };
                      }
                    );

                    this.players = this.players.map((player) => {
                      const isSelected = lineupPlayers.find(
                        (item: any) => item.player_id === player.id
                      );

                      if (isSelected) {
                        const hasType = this.typePlayers.find(
                          (type) => type.id === isSelected.type_player_id
                        );

                        return {
                          ...player,
                          type_player_id: isSelected.type_player_id,
                          type_player_color: hasType?.color,
                          type_player_code: hasType?.code,
                        };
                      }

                      return {
                        ...player,
                      };
                    });

                    this.selectedPlayerList = res.data.map(
                      (item: any, i: number) => {
                        delete item.competititon_match_id;

                        return {
                          ...item,
                          type_player_id: item.lineup_player_type_id,
                          id: item.player_id,
                        };
                      }
                    );
                  }

                  if (!lineUp && res.data.length === 0) {
                    this.msg.error('No se encontraron resultados');
                  }

                  this.loadingLastMatch = false;
                },
                ({ error }) => {
                  this.msg.error(error);
                }
              );
          } else {
            this.msg.error('No se encontraron resultados');
            this.loadingLastMatch = false;
          }
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  /**
   * get player type from dropdown
   */
  getPlayertypeDropdown(): void {}

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
   * handleReferee
   */
  handleReferee(): void {
    this.refereeInput = !this.refereeInput;
  }

  /**
   * Submit form
   */
  onSubmit(): void {
    this.loading = true;
    let start_at: string = '';

    const isDate = this.matchForm.get('start_at')?.value instanceof Date;

    if (!isDate) {
      const splitdate: string = this.matchForm
        .get('start_at')
        ?.value.split(' ')[0]
        .split('/');
      const date = `${splitdate[2]}-${splitdate[1]}-${splitdate[0]}`;
      const hour: string = this.matchForm.get('start_at')?.value.split(' ')[1];
      start_at = `${date}T${hour}`;
    } else {
      start_at = this.matchForm.get('start_at')?.value;
    }

    const match: Match = {
      ...this.matchForm.value,
      competition_rival_team_id: this.matchForm.get('competition_rival_team_id')
        ?.value,
      weather_id: this.matchForm.get('weather_id')?.value,
      referee_id: this.matchForm.get('referee_id')?.value,
      start_at,
      competition_id: parseInt(this.competitionId),
      team_id: this.team.id,
      lineup: {
        type_lineup_id: this.selectedTypeLineup?.id,
        players: this.selectedPlayerList
          .filter((player) => !!player.type_player_id)
          .map((player, i) => ({
            player_id: player.id,
            lineup_player_type_id: player.type_player_id,
            order: i,
          })),
      },
    };

    if (!this.selectedTypeLineup?.id) delete match.lineup.type_lineup_id;
    if (!this.matchForm.get('modality_id')?.value) delete match.modality_id;

    if (this.match) {
      if (this.matchForm.get('referee_name')?.value) {
        const name = this.matchForm.get('referee_name')?.value;

        this.handleRefereeCall(
          match,
          name,
          this.team.id,
          'edit',
          this.handleEditMatchForm,
          this.match.id as number
        );
      } else {
        this.handleEditMatchForm(match, this.team.id, this.match.id as number);
      }
    } else {
      if (this.matchForm.get('referee_name')?.value) {
        const name = this.matchForm.get('referee_name')?.value;

        this.handleRefereeCall(
          match,
          name,
          this.team.id,
          'create',
          this.handleCreateMatchForm
        );
      } else {
        this.handleCreateMatchForm(match);
      }
    }
  }

  /**
   * create referee by name
   * @param match
   * @param name
   * @param teamId
   * @param callBack
   */
  handleRefereeCall(
    match: Match,
    name: string,
    teamId: number,
    type: string,
    callBack: any,
    matchId?: number
  ): void {
    callBack = callBack.bind(this);
    this.competitionService.createRefereeByName(name, teamId).subscribe(
      (res) => {
        match.referee_id = res.data.id;

        if (type === 'create') {
          callBack(match);
        } else {
          callBack(match, teamId, matchId);
        }
      },
      ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      }
    );
  }

  /**
   * create match
   * @param match
   */
  handleCreateMatchForm(match: Match): void {
    this.competitionService.createMatchCompetition(match).subscribe(
      (res) => {
        if (res.success) {
          this.translate.get('matchCreatedSuccessfully').subscribe((res) => {
            this.msg.succes(res);
          });

          this.closeDialog();
          this.loading = false;
          this.refreshMatchList.emit(true);
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

            this.closeDialog();
            this.loading = false;
            this.refreshMatchList.emit(true);
          }
        },
        ({ error }) => {
          this.msg.error(error);
          this.loading = false;
        }
      );
  }
}
