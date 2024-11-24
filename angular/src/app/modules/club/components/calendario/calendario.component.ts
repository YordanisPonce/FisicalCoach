import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Competition, Match } from 'src/app/_models/competition';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { environment } from 'src/environments/environment';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { resourcesUrl } from 'src/app/utils/resources';
// import {SelectItem} from 'primeng/api';
// import esLocale from '@fullcalendar/core/locales/es';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss'],
})
export class CalendarioComponent implements OnInit, OnDestroy {
  team: any;
  loading: boolean = false;
  competitions: Competition[] = [];
  allCompetitions: Competition[] = [];
  matches: Match[] = [];
  $subscriber: Subscription;
  events: any[] = [];
  options: [];
  urlBase = environment.images;
  openMatchModal: boolean = false;
  selectedMatch: Match | any;
  locale: string = 'es';
  resources = resourcesUrl;

  constructor(
    private teamService: CompetitionService,
    private appStateService: AppStateService
  ) {}

  calendarOptions: CalendarOptions;
  selectedCompetition!: Competition;

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.locale = localStorage.getItem('languaje') as string;

    this.getCompetitions();

    this.calendarOptions = {
      // locale: esLocale,
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: '',
      },
      firstDay: 1,
      locale: { code: this.locale },
      eventContent: this.renderEventContent,
      navLinks: false,
      events: [],
      plugins: [dayGridPlugin, interactionPlugin],
      dayHeaderContent: (arg) => {
        const date = arg.date;
        const dayName = date.toLocaleDateString(this.locale, {
          weekday: 'short',
        });
        return dayName.charAt(0).toUpperCase() + dayName.slice(1);
      },
      titleFormat: (arg) => {
        const date = arg.date;
        const monthName = date.marker.toLocaleDateString(this.locale, {
          month: 'long',
        });
        const year = date.marker.getFullYear();
        return `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${
          this.locale === 'es' ? 'de' : ''
        } ${year}`;
      },
    };
  }

  /** Used to edit the calendar and add the match images */
  renderEventContent(eventInfo: any, createElement: any) {
    let innerHtml;
    let innerHtml2;
    let hour;

    //Check if event has image
    if (
      eventInfo.event._def.extendedProps.imageUrl &&
      eventInfo.event._def.extendedProps.imageUrl2 &&
      eventInfo.event._def.extendedProps.hour
    ) {
      const today = moment().format('YYYY-MM-DD');

      const bgToday =
        today === eventInfo.event._def.extendedProps.competitionDate;

      const bgColor = bgToday ? '#FFFADF' : '#fff';

      innerHtml =
        eventInfo.event._def.title +
        "<img style='width:27px; height: 26px; border-radius: 50%; ' src='" +
        eventInfo.event._def.extendedProps.imageUrl +
        "'>";
      innerHtml2 =
        eventInfo.event._def.title +
        "<img style='width:27px; height: 26px; border-radius: 50%; margin-left: 5px;' src='" +
        eventInfo.event._def.extendedProps.imageUrl2 +
        "'>";
      hour =
        eventInfo.event._def.title +
        "<span style='margin-left: 7px; color: #B1B3C4;'>" +
        eventInfo.event._def.extendedProps.hour +
        '</span>';
      //Event with rendering html
      return (createElement = {
        html:
          `<div style="cursor: pointer; background-color: ${bgColor};"  >` +
          innerHtml +
          innerHtml2 +
          hour +
          '</div>',
      });
    }
  }

  /**
   * Get competitios by team
   */
  getCompetitions(): void {
    this.loading = true;
    const id = this.team.id;
    let competitions: Competition[] = [];

    this.$subscriber = this.teamService
      .getCompetitionsListByTeam(id)
      .subscribe(async (res) => {
        this.competitions = res.data;
        this.allCompetitions = res.data;

        if (competitions.length > 0) {
        } else {
          this.loading = false;
        }
      });
  }

  /**
   * select calendar match
   * @param data
   */
  openCallBack(data: Match, competition: Competition): void {
    this.openMatchModal = true;
    const start_at_hour = moment(data.start_at).format('HH:mm');
    const start_at_date = moment(data.start_at).format('DD/MM/YYYY');

    this.selectedMatch = {
      ...data,
      current_team: this.team,
      start_at_hour,
      start_at_date,
      type_competition_name: competition.type_competition_name,
    };
  }

  /**
   * used to filter matches per competition
   * @param event
   */
  searchMatches(event: any) {
    const competitionId = event.value ? event.value.id : null;
    let matches: Match[] = [];

    this.$subscriber = this.teamService
      .getAllMatchesbyCompetition(competitionId)
      .subscribe((res) => {
        console.log(res);
        const data = res.data;

        matches = res.data.matches;

        if (competitionId) {
          this.events = matches.map((item) => {
            console.log(item);

            return {
              title: '',
              start: moment(item.start_at).format('YYYY-MM-DD'),
              competitionDate: moment(item.start_at).format('YYYY-MM-DD'),
              imageUrl: `${this.team.image.full_url}`,
              imageUrl2: `${
                item.competition_rival_team.url_image
                  ? this.urlBase + item.competition_rival_team.url_image
                  : `${this.resources}/images/competition/rival_team.svg`
              }`,
              hour: moment(item.start_at).format('HH:mm'),
              competition: event.value,
              match: item,
              callBack: this.openCallBack.bind(this),
            };
          });

          this.calendarOptions = {
            // locale: esLocale,
            initialView: 'dayGridMonth',
            headerToolbar: {
              left: 'prev,next',
              center: 'title',
              right: '',
            },

            eventContent: this.renderEventContent,
            navLinks: false,
            events: this.events,
            locale: { code: this.locale },
            firstDay: 1,
            eventClick: function (info) {
              info.jsEvent.preventDefault(); // don't let the browser navigate

              const callBack = info.event._def.extendedProps.callBack;
              const match = info.event._def.extendedProps.match;
              const competiton = info.event._def.extendedProps.competition;

              // pass the current match
              if (match) {
                callBack(match, competiton);
              }
            },
          };
        } else {
          this.calendarOptions = {
            // locale: esLocale,
            initialView: 'dayGridMonth',
            headerToolbar: {
              left: 'prev,next',
              center: 'title',
              right: '',
            },
            firstDay: 1,
            eventContent: this.renderEventContent,
            navLinks: false,
            events: [],
          };
        }
      });
  }

  /**
   * Search rivalteams per match
   * @param competition
   */
  searchRivalTeam(data: Match, competitions: Competition[]): Match {
    const competition = competitions.find(
      (item) => item.id === data.competition_id
    );

    const rivalTeam = competition?.teams.find(
      (team: { id: any }) => team.id === data.competition_rival_team_id
    );

    if (rivalTeam) {
      return {
        ...data,
        start_at: data.start_at,
        rival_team_image_url: rivalTeam.url_image,
        competition_rival_team_name: rivalTeam.rival_team,
      };
    }

    return {
      ...data,
    };
  }

  ngOnDestroy(): void {
    if (this.$subscriber) this.$subscriber.unsubscribe();
  }
}
