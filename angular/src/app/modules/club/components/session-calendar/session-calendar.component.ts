import { Component, OnDestroy, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Competition, Match } from 'src/app/_models/competition';
import { CompetitionService } from 'src/app/_services/competitions.service';
import { environment } from 'src/environments/environment';
import { TrainingExerciseSession } from 'src/app/_models/training';
import { TrainingSessionService } from 'src/app/_services/training.service';
import { Session } from 'src/app/_models/session';
import { Router } from '@angular/router';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
// import {SelectItem} from 'primeng/api';
// import esLocale from '@fullcalendar/core/locales/es';

interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-session-calendar',
  templateUrl: './session-calendar.component.html',
  styleUrls: ['./session-calendar.component.scss'],
})
export class SessionCalendarComponent implements OnInit {
  team: any;
  loading: boolean = false;
  trainingSessions: TrainingExerciseSession[] = [];
  $subscriber: Subscription;
  events: any[] = [];
  urlBase = environment.images;
  locale: string = 'es';
  role: string;

  constructor(
    private appStateService: AppStateService,
    private router: Router,
    private trainingSessionService: TrainingSessionService
  ) {}

  calendarOptions: CalendarOptions;
  selectedCompetition!: Competition;

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();
    this.locale = localStorage.getItem('languaje') as string;

    this.calendarOptions = {
      // locale: esLocale,
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: '',
      },
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

    this.getSessionsByRole();
  }

  /** Used to edit the calendar and add the match images */
  renderEventContent(eventInfo: any, createElement: any) {
    let innerHtml;
    let hour;

    //Check if event has image
    if (
      eventInfo.event._def.extendedProps.imageUrl &&
      eventInfo.event._def.extendedProps.hour
    ) {
      // Store custom html code in variable

      const today = moment().format('YYYY-MM-DD');

      const bgToday = today === eventInfo.event._def.extendedProps.sessionDate;

      const bgColor = bgToday ? '#FFFADF' : '#fff';

      if (eventInfo.event._def.extendedProps.imageUrl !== 'undefined') {
        innerHtml =
          "<img style='width:27px; height: 26px; border-radius: 50%; ' src='" +
          eventInfo.event._def.extendedProps.imageUrl +
          "' />";
      } else {
        innerHtml = `<div style='background-color: ${eventInfo.event._def.extendedProps.colorTeam}; width: 27px; height: 26px; border-radius: 50%;'></div> `;
      }

      hour =
        "<span style='margin-left: 7px;'>" +
        eventInfo.event._def.title +
        '</span>' +
        "<div style='margin-left: 8px; color: #B1B3C4;'>" +
        eventInfo.event._def.extendedProps.hour +
        '</div>';
      //Event with rendering html
      return (createElement = {
        html: `<div style="cursor: pointer; display: flex; background-color: ${bgColor};"  > ${innerHtml} <div>${hour}</div> </div>`,
      });
    }
  }

  getSessionsByRole(): void {
    if (this.role === 'sport') {
      this.getTrainingSessionList(this.team.id);
    } else {
      this.getClassroomTrainingSessionList(this.team.id);
    }
  }

  /**
   * training session list
   */
  getTrainingSessionList(team_id: number): void {
    this.loading = true;
    this.getList(team_id);
  }

  /**
   * get list
   */
  getList(team_id: number): void {
    this.$subscriber = this.trainingSessionService
      .getTrainingSessionList(team_id)
      .subscribe(
        (res) => {
          if (res.success) {
            this.trainingSessions = res.data;

            this.fillCalendarOptions(this.trainingSessions);
          }

          this.loading = false;
        },
        ({ error }) => {
          console.log(error);
          this.loading = false;
        }
      );
  }

  /**
   * training session list
   */
  getClassroomTrainingSessionList(classroomId: number): void {
    this.loading = true;
    this.getClassroomList(classroomId);
  }

  /**
   * get lis for Classroom
   */

  getClassroomList(classroomId: number): void {
    this.$subscriber = this.trainingSessionService
      .getClassroomTrainingSessionList(classroomId)
      .subscribe(
        (res) => {
          if (res.success) {
            this.trainingSessions = res.data;
          }

          this.loading = false;
        },
        ({ error }) => {
          console.log(error);
          this.loading = false;
        }
      );
  }

  fillCalendarOptions(sessions: TrainingExerciseSession[]): void {
    this.events = sessions.map((item) => {
      return {
        title: item.title,
        start: moment(item.exercise_session_execution.date_session).format(
          'YYYY-MM-DD'
        ),
        sessionDate: moment(
          item.exercise_session_execution.date_session
        ).format('YYYY-MM-DD'),
        imageUrl: `${this.team?.image?.full_url}`,
        sessionCode: item.code,
        hour: item.exercise_session_execution.hour_session,
        router: this.router,
        colorTeam: this.team.color,
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
      locale: { code: this.locale },
      firstDay: 1,
      events: this.events,
      eventClick: function (info) {
        info.jsEvent.preventDefault(); // don't let the browser navigate

        const extendedProps = info.event._def.extendedProps;

        extendedProps.router.navigate([
          `/club/training-sessions/details/${extendedProps.sessionCode}`,
        ]);
      },
    };
  }

  ngOnDestroy(): void {
    if (this.$subscriber) this.$subscriber.unsubscribe();
  }
}
