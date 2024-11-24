import { Component, OnInit } from '@angular/core';
import { DailyCheckService } from 'src/app/_services/daily-check.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import HandleErrors from '../../../../utils/errors';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';


type action = 'reset' | 'resetAll' | 'updatedControl' | null;

@Component( {
  selector: 'app-daily-check',
  templateUrl: './daily-check.component.html',
  styleUrls: [ './daily-check.component.scss' ],
  providers: [ DatePipe ],
} )
export class DailyCheckComponent extends HandleErrors implements OnInit {
  
  urlImages = environment.images;
  girlAlumnImage: string = this.urlImages + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.urlImages + 'images/alumn/alumno.svg';
  loading: boolean = false;
  resetDialog: boolean = false;
  responsiveOptions: any;
  students: any = [];
  studentsList: any = [];
  dailyCheckIcons: any = [];
  lastAction: action = null;
  undoAction: any = {
    active: false,
    data: {},
    body: null
  };
  redoAction: any = {
    active: false,
    body: null
  };
  images: string = environment.images;
  
  constructor( private appStateQuery: AppStateQuery,
               private translate: TranslateService,
               public alerts: AlertsApiService,
               private dailyCheck: DailyCheckService,
               private datePipe: DatePipe,
               private appStateService: AppStateService ) {
    super( alerts );
    this.responsiveOptions = [
      {
        breakpoint: '1920px',
        numVisible: 9,
        numScroll: 2
      },
      {
        breakpoint: '1200px',
        numVisible: 5,
        numScroll: 2
      },
      {
        breakpoint: '1200px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '576px',
        numVisible: 4,
        numScroll: 4
      }
    ];
  }
  
  get academicYearEnabled() {
    let valid = true;
    const school = this.appStateService.getSchool();
    const academicYears = school.academic_years;
    const activeAcademicYear = academicYears.filter( ( year: any ) => year.is_active );
    if ( activeAcademicYear.length > 0 ) {
      let periodActive: number = 0;
      activeAcademicYear.map( ( x: any ) => {
        if ( x.academic_periods.filter( ( period: any ) => period.is_active ).length > 0 ) {
          periodActive++;
        }
      } );
      valid = periodActive > 0;
    } else {
      valid = false;
    }
    return valid;
  }
  
  getClassroomId(): string {
    let classroomId = '';
    this.appStateQuery.class$.subscribe( res => {
      classroomId = res.id;
    } );
    return classroomId;
  }
  
  searchAlumn( event: any ) {
    const search = event.target.value.toLowerCase();
    const filter = this.studentsList.filter( ( item: any ) => item.name?.toLowerCase().includes( search ) );
    
    if ( search.length > 0 ) {
      this.students = filter;
    } else {
      this.students = this.studentsList;
    }
  }
  
  getDailyCheckItems() {
    this.dailyCheck.getDailyControlItems().subscribe( ( res: any ) => {
      this.dailyCheckIcons = res.data;
    } );
  }
  
  getClassroomList() {
    this.dailyCheck.getClassroomDailyControlList( this.getClassroomId() ).subscribe( ( res: any ) => {
      this.students = this.studentsList = res.data;
      this.loading = false;
    }, error => {
      this.handleError( error, this.translate.instant( 'errorlist' ) );
      this.loading = false;
    } );
  }
  
  getDailyControlData( controlData: any, newCount?: boolean ) {
    const data = {
      alumn_id: controlData.data.alumn_id,
      reset: false,
      control_items: [
        {
          daily_control_item_id: controlData.data.daily_control_item_id,
          count: newCount === undefined ? controlData.data.count : newCount ? controlData.data.count + 1 : controlData.data.count - 1,
        }
      ]
    };
    if ( controlData.reset ) {
      data.reset = true;
    }
    return data;
  }
  
  undo() {
    switch ( this.lastAction ) {
      case 'updatedControl': {
        this.dailyCheck.updateStudentDailyControl( this.getClassroomId(), this.getDailyControlData( {
          ...this.undoAction,
          reset: true
        } ) ).subscribe( ( res: any ) => {
          const dailyControl = this.undoAction.dailyControl;
          dailyControl.count = dailyControl.count - 1;
          dailyControl.updated_at = dailyControl.reset_at;
          this.redoAction.active = true;
        } );
        break;
      }
      case 'reset': {
        const index = this.studentsList.findIndex( ( el: any ) => el.id === this.undoAction.data.id );
        this.dailyCheck.updateStudentDailyControl( this.getClassroomId(), this.undoAction.body ).subscribe( ( res: any ) => {
          this.studentsList[ index ] = this.undoAction.data;
          this.redoAction.active = true;
        } );
        break;
      }
      default: {
      
      }
    }
    this.undoAction.active = false;
  }
  
  redo() {
    switch ( this.lastAction ) {
      case 'updatedControl': {
        this.dailyCheck.updateStudentDailyControl( this.getClassroomId(), this.getDailyControlData( this.redoAction ) )
          .subscribe( ( res: any ) => {
            const dailyControl = this.redoAction.dailyControl;
            dailyControl.count = dailyControl.count + 1;
            dailyControl.updated_at = this.getEuropeanDate();
          } );
        break;
      }
      case 'reset': {
        const index = this.studentsList.findIndex( ( el: any ) => el.id === this.undoAction.data.id );
        this.studentsList[ index ] = this.undoAction.data;
        this.dailyCheck.resetStudentDailyControl( this.getClassroomId(), { alumn_id: this.redoAction.alumnId } )
          .subscribe( ( res: any ) => {
            this.studentsList[ index ].control_items.forEach( ( el: any ) => {
              el.count = 0;
              el.updated_at = this.datePipe.transform( new Date(), 'yyyy-MM-dd h:mm:ss' );
            } );
            this.undoAction.active = true;
            this.redoAction.active = false;
          } );
        break;
      }
      default: {
      }
    }
    this.redoAction.active = false;
    this.undoAction.active = true;
  }
  
  updateDailyControl( dailyControl: any ) {
    // VALIDATE IF ELEMENT WAS PRESSED TODAY
    if ( !this.disabledOption( dailyControl.updated_at ) ) {
      // SET CURRENT CONTROL ITEM FOR UNDO ACTION
      this.undoAction.data = JSON.parse( JSON.stringify( dailyControl ) );
      this.undoAction.dailyControl = this.redoAction.dailyControl = dailyControl;
      const data = {
        alumn_id: dailyControl.alumn_id,
        control_items: [
          {
            daily_control_item_id: dailyControl.daily_control_item_id,
            count: dailyControl.count + 1
          }
        ]
      };
      this.dailyCheck.updateStudentDailyControl( this.getClassroomId(), data ).subscribe( ( res: any ) => {
        this.redoAction.data = JSON.parse( JSON.stringify( dailyControl ) );
        dailyControl.count = dailyControl.count + 1;
        dailyControl.updated_at = this.getEuropeanDate();
        this.lastAction = 'updatedControl';
        this.undoAction.active = true;
        this.redoAction.active = false;
      } );
    }
  }
  
  disabledOption( option: any ): boolean  {
    if ( this.academicYearEnabled ) {
      if ( option.reset_at === null ) {
        return false;
      }
      const resetDate = new Date( option.reset_at ).valueOf();
      const updatedDate = new Date( option.updated_at ).valueOf();
      if ( resetDate === updatedDate ) {
        return false;
      }
      return resetDate < updatedDate;
    } else {
      return true;
    }
    
  }
  
  resetDailyControl( studentId: string ) {
    // SAVE CURRENT STUDENT CONTROL ITEMS FOR UNDO ACTION
    const currentControlItems: any = [];
    const index = this.studentsList.findIndex( ( student: any ) => student.id == studentId );
    this.studentsList[ index ].control_items.forEach( ( el: any ) => {
      currentControlItems.push( {
        daily_control_item_id: el.daily_control_item_id,
        count: el.count
      } );
    } );
    // Set the undo data
    const oldData = JSON.parse( JSON.stringify( this.studentsList[ index ] ) );
    this.undoAction.data = oldData;
    this.undoAction.body = {
      alumn_id: studentId,
      control_items: currentControlItems
    };
    // send API request
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'CET' };
    
    this.dailyCheck.resetStudentDailyControl( this.getClassroomId(), { alumn_id: studentId } as any ).subscribe( ( res: any ) => {
        const nowDate = this.getEuropeanDate();
        this.studentsList[ index ].control_items.forEach( ( el: any ) => {
          el.count = 0;
          el.updated_at = nowDate;
          el.reset_at = nowDate;
        } );
        this.undoAction.active = true;
        this.redoAction.alumnId = studentId;
        this.lastAction = 'reset';
      },
      ( error ) => {
      } );
  }
  
  resetAll() {
    const nowDate = this.getEuropeanDate();
    this.dailyCheck.resetStudentDailyControl( this.getClassroomId() ).subscribe( ( res: any ) => {
      this.studentsList.forEach( ( student: any ) => {
        student.control_items = student.control_items.map( ( item: any ) => Object.assign( item, {
          count: 0,
          updated_at: nowDate,
          reset_at: nowDate
        } ) );
      } );
      this.resetDialog = false;
      this.lastAction = 'resetAll';
    } );
  }
  
  ngOnInit(): void {
    this.loading = true;
    this.getClassroomList();
  }
  
  private getEuropeanDate() {
    const actualDate = new Intl.DateTimeFormat( 'en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'Europe/Madrid'
    } ).format( new Date() );
    const splitDate = actualDate.replace( ', ', ' ' ).split( ' ' );
    const [ d, m, y ] = splitDate[ 0 ].split( '/' );
    return `${ y }-${ m }-${ d } ${ splitDate[ 1 ] }`;
  }
}
