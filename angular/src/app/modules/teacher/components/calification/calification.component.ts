import { Component, OnInit } from '@angular/core';
import { QualificationService } from 'src/app/_services/qualification.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component( {
  selector: 'app-calification',
  templateUrl: './calification.component.html',
  styleUrls: [ './calification.component.scss' ],
  providers: [ ConfirmationService ]
} )
export class CalificationComponent implements OnInit {
  
  images: string = environment.images;
  responsiveOptions: any;
  girlAlumnImage: string = this.images + 'images/alumn/alumna.svg';
  boyAlumnImage: string = this.images + 'images/alumn/alumno.svg';
  loading: boolean = false;
  loadingPDF: boolean = false;
  calificationDialog: boolean = false;
  alumnQualificationsDialog: boolean = false;
  qualificationList: any;
  qualificationListAll: any;
  academicYearId: string;
  qualification: any;
  details: boolean | undefined;
  urlImages: string = environment.images;
  views: any;
  selectedView: string = 'qualifications';
  qualificationId: string | undefined;
  alumnQualificationId: string | undefined;
  alumnQualificationName: string | undefined;
  classroomStudents: any = [];
  classroomStudentsAll: any = [];
  inputSearch:string='';
  constructor( private qualificationService: QualificationService,
               private translate: TranslateService,
               private appStateService: AppStateService,
               private confirmationService: ConfirmationService,
               private msg: AlertsApiService
  ) {
    this.academicYearId = appStateService.getClass().active_academic_years.classroom_academic_year_id;
    this.responsiveOptions = [
      {
        breakpoint: '1920px',
        numVisible: 5,
        numScroll: 1
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
  resetFilter() {
    this.inputSearch = '';
    this.qualificationList = this.qualificationListAll;
    this.classroomStudents = this.classroomStudentsAll;
  }
  
  search( event: any ) {
    const search = event.target.value.toLowerCase();
    if ( this.selectedView === 'qualifications' ) {
      const filter = this.qualificationListAll.filter( ( item: any ) => item?.title?.toLowerCase().includes( search ) );
      if ( search.length > 0 ) {
        this.qualificationList = filter;
      } else {
        this.qualificationList = this.qualificationListAll;
      }
    } else {
      const filter = this.classroomStudentsAll.filter( ( item: any ) => item?.alumn?.full_name?.toLowerCase().includes( search ) );
      if ( search.length > 0 ) {
        this.classroomStudents = filter;
      } else {
        this.classroomStudents = this.classroomStudentsAll;
      }
    }
    
  }
  getQualifications() {
    this.qualificationService.getQualificationList( this.academicYearId ).subscribe( ( res: any ) => {
      this.qualificationList = res.data;
      this.qualificationListAll = res.data;
      this.loading = false;
    } );
    
  }
  
  getClassroomStudents() {
    this.qualificationService.getAlumnsQualifications( this.appStateService.getClassroomAcademicYear() ).subscribe( ( res: any ) => {
      this.classroomStudents = res.data;
      this.classroomStudentsAll = res.data;
      this.loading = false;
    } );
  }
  
  showQualification( qualification: any ) {
    console.log( qualification );
    this.qualification = qualification;
    this.details = true;
    this.calificationDialog = true;
  }
  
  downloadPDFAll(studen: any) {
    this.loadingPDF = true

    this.qualificationService.getPDFAll(studen.alumn.id,studen.qualifications[0].qualification?.classroom_academic_year_id )
    .subscribe(
      (res) => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(res)
        a.href = objectUrl
        a.download = `${studen.alumn.full_name}.pdf`;
        a.click();
        URL.revokeObjectURL(objectUrl);
        this.loadingPDF = false
      },
      ({error}) => {
        this.msg.error(error);
        this.loadingPDF = false;
      }
    );
  }

  alumnQualificationsDetails( qualificationId: any, alumnId: string, alumnName: string ) {
    this.alumnQualificationsDialog = true;
    
    
    this.alumnQualificationName = alumnName;
    this.alumnQualificationId = alumnId; 
    this.qualificationId = qualificationId;
  }
  
  editQualification( qualification: any ) {
    // console.log(qualification)
    this.qualification = qualification;
    this.calificationDialog = true;
  }
  
  deleteQualification( qualificationId: string ) {
    this.qualificationService.deleteQualification( qualificationId ).subscribe( ( res: any ) => {
      this.getQualifications();
      this.getClassroomStudents();
    } );
  }
  
  confirm( qualificationId: any ) {
    this.confirmationService.confirm( {
      message: this.translate.instant( 'LBL_CONFIRM_DIALOG' ),
      acceptLabel: this.translate.instant( 'LBL_YES' ),
      rejectLabel: this.translate.instant( 'LBL_NO' ),
      accept: () => {
        //Actual logic to perform a confirmation
        this.deleteQualification( qualificationId );
      }
    } );
  }
  
  ngOnInit(): void {
    forkJoin(
      this.translate.get( 'qualification.qualifications' ),
      this.translate.get( 'evaluation.students' ) ).subscribe( ( [ general, info ] ) => {
      this.views = [
        { name: general, value: 'qualifications' },
        { name: info, value: 'students' },
      ];
    } );
    
    this.loading = true;
    this.getQualifications();
    this.getClassroomStudents();
  }
  
}
