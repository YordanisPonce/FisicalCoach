import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Competition, Match } from 'src/app/_models/competition';
import { Team } from 'src/app/_models/team';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Location } from '@angular/common';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'app-competicion-details',
  templateUrl: './competicion-details.component.html',
  styleUrls: ['./competicion-details.component.scss'],
})
export class CompeticionDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private competitionService: CompetitionService,
    private appStateService: AppStateService,
    private route: ActivatedRoute,
    private location: Location,
    private msg: AlertsApiService
  ) {}

  newGameDialog: boolean = false;
  $subscribe: Subscription;
  loading: boolean = false;
  loadingMatches: boolean = false;
  loadingPlayers: boolean = false;
  competitionDetails: Competition;
  urlBase = environment.images;
  team: ITeam;
  competitionId: any;
  selectedMatch: Match | any;
  matchDate: any;
  matchMaxDate: Date;
  oneStepSports: string[] = ['swimming', 'tennis', 'badminton', 'padel'];

  matches: any = [];

  ngOnInit(): void {
    this.competitionId = this.route.snapshot.paramMap.get('id');
    this.getDetailsById();
  }

  /**
   * get competition details by id
   */
  getDetailsById(): void {
    this.loading = true;
    this.team = this.appStateService.getTeam();

    this.$subscribe = this.competitionService
      .getCompetitionDetailsById(this.competitionId as number)
      .subscribe(
        (res) => {
          this.competitionDetails = res.data;

          this.matchMaxDate = new Date(res.data.date_end);

          this.matches = res.data.matches;

          this.loading = false;
        },
        ({ error }) => {
          if (!error?.success) {
            this.msg.error(error);
            setTimeout(() => {
              this.location.back();
            }, 2000);
          }
        }
      );
  }

  /**
   * validate match end date
   */
  validateEndDate(endDate: Date): boolean {
    const parseEndDate = moment(endDate).format('YYYY-MM-DD');
    const parseToday = moment().format('YYYY-MM-DD');

    return moment(parseToday).isAfter(parseEndDate);
  }

  /**
   *
   * @param match
   */
  openMatchDialog(): void {
    this.newGameDialog = true;
    this.selectedMatch = null;
  }

  /**
   * open match to update
   * @param match
   */
  editMatch(match: Match): void {
    // this.selectedMatch = match;

    this.$subscribe = this.competitionService
      .getMatchByTeam(match.id as number, this.team.id)
      .subscribe((res) => {
        this.selectedMatch = res.data;

        const utcHours = moment.utc(this.selectedMatch.start_at).get('hours');
        const utcTime = moment(this.selectedMatch.start_at)
          .set('hours', utcHours)
          .toDate();

        this.matchDate = utcTime;

        this.newGameDialog = true;
      });
  }

  /**
   * refresh list after create or update
   */
  refreshMatchList(): void {
    this.matches = [];
    this.getDetailsById();
  }

  closeMatchDialog(): void {
    this.matchDate = new Date();
    this.newGameDialog = false;
    this.selectedMatch = null;
  }

  /**
   * check swimming sport
   */
  isSwimmingSport(sport: string): boolean {
    return sport !== 'swimming';
  }

  ngOnDestroy(): void {
    if (this.$subscribe) this.$subscribe.unsubscribe();
  }
}
