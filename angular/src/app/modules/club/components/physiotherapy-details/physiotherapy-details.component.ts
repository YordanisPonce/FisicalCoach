import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { PhysiotherapyService } from 'src/app/_services/fisiotherapy.service';
import { TestService } from 'src/app/_services/test.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { RFDTest, Test } from 'src/app/_models/test';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-physiotherapy-details',
  templateUrl: './physiotherapy-details.component.html',
  styleUrls: ['./physiotherapy-details.component.scss'],
})
export class PhysiotherapyDetailsComponent implements OnInit, OnDestroy {
  constructor(
    public activatedroute: ActivatedRoute,
    private appStateService: AppStateService,
    private physiotherapyService: PhysiotherapyService,
    private testService: TestService,
    private msg: AlertsApiService,
    private location: Location
  ) {}

  playerEvolutionDialog: boolean = false;
  trabajoDiarioDialog: boolean = false;
  file_id: any;
  team: any;
  player_id: string | null;
  test: RFDTest;
  loadingTest: boolean = false;
  date: string;
  testDetails: any;
  events: any[] = [];
  selectedDailyWork: any;
  locale: string = 'es';

  calendarOptions: CalendarOptions;

  sub$ = new Subscription();
  evaluationList: any = [
    {
      title: 'Balance articular',
      value: 'muy buena',
    },
    {
      title: 'Balance múscular',
      value: 'muy buena',
    },
    {
      title: 'Grado de estabilidad',
      value: 'regular',
    },
    {
      title: 'Carga corporal',
      value: 'mala',
    },
    {
      title: 'Dolor',
      value: 'moderado',
    },
    {
      title: 'Inflamacion',
      value: 'moderado',
    },
    {
      title: 'Edema',
      value: 'grado 0',
    },
    {
      title: 'Habilidades motrices básicas',
      value: 'buena',
    },
    {
      title: 'Capacidades físicas básicas',
      value: 'buena',
    },
    {
      title: 'Capacidad funcional',
      value: 'buena',
    },
  ];

  ngOnInit(): void {
    this.locale = localStorage.getItem('languaje') as string;
    this.calendarOptions = this.defaultCalendarOptions([]);
    this.file_id = this.appStateService.getPlayerFileId();
    this.team = this.appStateService.getTeam();
    this.player_id = this.activatedroute.snapshot.paramMap.get('id');

    this.getTestApplied();
  }

  /**
   * get test information
   */
  getTestApplied(): void {
    this.sub$ = this.physiotherapyService
      .getTestinformation(
        this.file_id,
        this.team.id,
        this.player_id as unknown as number
      )
      .subscribe(
        (res) => {
          this.testDetails = res.data;

          if (this.testDetails && this.testDetails?.previous_application) {
            this.events = [
              {
                title: '',
                date: moment(
                  this.testDetails.previous_application.date_application
                ).format('YYYY-MM-DD'),
                test_applied: true,
                data: {
                  date: moment(
                    this.testDetails.previous_application.date_application
                  ).format('YYYY-MM-DD'),
                },
                callBack: this.openCallBack.bind(this),
              },
            ];
          }
          this.getPlayerDailyWork(this.team.id, this.player_id, this.file_id);
        },
        ({ error }) => {
          if (!error.success) {
            this.msg.error(error.message);
            setTimeout(() => {
              this.location.back();
            }, 2000);
          }
        }
      );
  }

  /**
   * default options
   */
  defaultCalendarOptions(events: any[]): CalendarOptions {
    return {
      // locale: esLocale,
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: '',
      },
      eventContent: this.renderEventContent,
      events: events,
      locale: localStorage.getItem('languaje') as string,
      firstDay: 1,
      navLinks: false,
      dateClick: this.openDialog.bind(this),
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

    if (eventInfo.event._def.extendedProps.daily_work) {
      innerHtml = `
      <div style='display: flex; align-items: center;'>
        <div style='width:20px; height: 20px; border-radius: 50%; background-color: #ffe53e'></div> 
        <span style='color: #000; font-size: 12px; margin-left: 5px;'>${
          eventInfo.event._def.extendedProps.minutes_duration
        }${"'"}</span>
      </div>`;
    }

    if (eventInfo.event._def.extendedProps.test_applied) {
      innerHtml2 = `<div style='width:20px; height: 20px; border-radius: 50%; background-color: #00E9C5'></div>`;
    }

    if (!innerHtml2 && innerHtml) {
      return (createElement = {
        html:
          `<div style="cursor: pointer; background-color: ${
            moment().format('YYYY-MM-DD') ===
            eventInfo.event._def.extendedProps.data.work_date
              ? '#FFFADF'
              : '#fff'
          }">` +
          innerHtml +
          '</div>',
      });
    }

    if (innerHtml2 && !innerHtml) {
      return (createElement = {
        html:
          `<div style="cursor: pointer; background-color: ${
            moment().format('YYYY-MM-DD') ===
            eventInfo.event._def.extendedProps.data.date
              ? '#FFFADF'
              : '#fff'
          }">` +
          innerHtml2 +
          '</div>',
      });
    }
  }

  /**
   * select calendar match
   * @param data
   */
  openCallBack(data: any): void {
    this.selectedDailyWork = data;
    this.trabajoDiarioDialog = true;
  }

  /**
   * get player daily work
   */
  getPlayerDailyWork(team_id: number, player_id: any, file_id: number): void {
    this.sub$ = this.physiotherapyService
      .getPlayerDailyWork(team_id, parseInt(player_id), file_id)
      .subscribe(
        (res) => {
          const daily_works = res.data.daily_works;

          if (daily_works.length > 0) {
            this.events = this.events.filter((event) => event?.test_applied);

            this.events = [
              ...this.events,
              ...daily_works.map((item: any) => {
                return {
                  title: '',
                  date: moment(item.work_date).format('YYYY-MM-DD'),
                  daily_work: true,
                  callBack: this.openCallBack.bind(this),
                  minutes_duration: item.minutes_duration,
                  data: item,
                };
              }),
            ];

            this.calendarOptions = {
              // locale: esLocale,
              initialView: 'dayGridMonth',
              headerToolbar: {
                left: 'prev,next',
                center: 'title',
                right: '',
              },
              eventContent: this.renderEventContent,
              locale: localStorage.getItem('languaje') as string,
              firstDay: 1,
              navLinks: false,
              events: this.events,
              // dateClick: this.openDialog.bind(this),
              eventClick: function (info) {
                info.jsEvent.preventDefault(); // don't let the browser navigate

                const callBack = info.event._def.extendedProps.callBack;
                const data = info.event._def.extendedProps.data;

                if (data) {
                  callBack(data);
                }
              },
            };
          } else {
            this.calendarOptions = this.defaultCalendarOptions(this.events);
          }
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  /**
   * get test information
   */
  testInformation(): void {
    this.loadingTest = true;
    this.sub$ = this.testService.showTest('recovery_fisiotherapy').subscribe(
      (res) => {
        this.test = res.data;
        this.playerEvolutionDialog = true;
        this.loadingTest = false;
      },
      ({ error }) => {
        this.msg.error(error);
        this.playerEvolutionDialog = false;
        this.loadingTest = false;
      }
    );
  }

  /**
   * open daily work dialog from calendar
   */
  openDialog(arg: any): void {
    const findEvent = this.events.find(
      (event) => event.date === arg.dateStr && !event.test_applied
    );

    if (!findEvent) {
      this.date = arg.dateStr;
      this.trabajoDiarioDialog = true;
    }
  }

  /**
   * reset daily work data
   */
  resetDailyWork(): void {
    this.trabajoDiarioDialog = false;
    this.selectedDailyWork = null;
  }

  ngOnDestroy(): void {
    if (this.sub$) this.sub$.unsubscribe();
  }
}
