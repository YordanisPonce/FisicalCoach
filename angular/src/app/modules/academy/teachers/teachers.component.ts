import { Component, OnInit } from '@angular/core';
import { ClubService } from 'src/app/_services/club.service';
import { SchoolService } from 'src/app/_services/school.service';
import { SelectItem } from 'src/app/_models/selectItem';
import { GeneralService } from 'src/app/_services/general.service';
import { Club } from 'src/app/_models/club';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core'
import {forkJoin, Subscription} from "rxjs";
import {ConfirmationService} from 'primeng/api';
import { AppStateService } from 'src/app/stateManagement/appState.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
  providers: [ConfirmationService]
})
export class TeachersComponent implements OnInit {
  teachers: any [] = [];
  newTeacherDialog:boolean = false
  advancedTeacherDialog:boolean = false
  assingTeacherDialog:boolean = false
  showModal = false;
  showDataAdvance = false;
  viewMember = false;
  loading = true;
  dataBasic: any;
  listJobArea: SelectItem [] = [];
  listGender: SelectItem [] = [];
  club: Club;
  typeFilter: string;
  filter = '';
  urlBase = environment.images;

  translations:any = {} 

  constructor( 
    private clubService: ClubService,
    private schoolService: SchoolService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private generalService: GeneralService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService 
    ) {
  }

  ngOnInit(): void {
    forkJoin(
      this.translate.get('LBL_CONFIRM_DELETE'),
      this.translate.get('LBL_CONFIRM_DIALOG'),
      this.translate.get('LBL_YES'),
      this.translate.get('LBL_NO'),
      ).subscribe(([confirmDelete,confirmDialog, yes, no]) => {
        this.translations = {
          confirmDelete: confirmDelete,
          confirmDialog: confirmDialog,
          yes: yes,
          no: no,
        }
    });

    this.loadList();
    this.appStateQuery.club$.subscribe( (res: any) => {
      this.club = res;
      this.loadListMember();
    } );
  }
  
  loadList() {
    this.showDataAdvance = false;
    this.showModal = false;
    this.schoolService.getListTeacherAreas(this.appStateService.getSchool().id).subscribe( res => {
      // console.log(res)
      this.listJobArea = res.data;
    } );
    this.appStateQuery.listGender$.subscribe( data => {
      this.listGender = [];
      const genders = Object.assign([], data);
      genders.map( ( r: any ) => {
        if ( r.id !== 0 ) {
          this.listGender.push( { label: ( r.code ), value: r.id } );
        }
      } );
    });
  }

  loadListMember() {
    this.showModal = false;
    this.showDataAdvance = false;
    this.teachers = [];
    this.loading = true;
    let filter = 'club_id=' + this.club.id;
    if (this.typeFilter){
      filter += '&order=' + this.typeFilter;
    }
    this.schoolService.getTeacherList(this.club.id ).subscribe( r => {
      // console.log(r)
      this.teachers = r.data;
      this.loading = false;
    }, error => {
      this.teachers = [];
      this.loading = false;
    } );
  }

  getTeacherDetails(teacherId:number){
    this.schoolService.showTeacherByClassroom(this.appStateService.getSchool().id,teacherId).subscribe(res => {
      // console.log(res)
      this.dataBasic = res.data
    })
  }

  handleEdit(teacherId: any){
    this.viewMember = false;
    // this.dataBasic = data;
    this.getTeacherDetails(teacherId)
    this.advancedTeacherDialog = true;
  }

  handleView(teacherId: number){
    this.viewMember = true;
    // this.dataBasic = data;
    this.getTeacherDetails(teacherId)
    this.advancedTeacherDialog = true;
  }

  handleDelete(data: any){
    this.schoolService.deleteTeacherByClassroom(this.club.id, data.id).subscribe( r => {
      this.teachers = []
      this.loadListMember();
    });
  }

  handleCreate(){
    this.viewMember = false;
    this.dataBasic = {};
    this.showDataAdvance = true;
    this.showModal = false;
  }
  
  handleQuickCreate(){
    this.dataBasic = {};
    // this.showDataAdvance = false;
    // this.showModal = true;
    this.newTeacherDialog = true
  }
  
  confirm(data:any) {
    this.confirmationService.confirm({
        header: this.translations.confirmDelete,
        message: this.translations.confirmDialog,
        acceptLabel: this.translations.yes,
        rejectLabel: this.translations.no,
        accept: () => {
            //Actual logic to perform a confirmation
            // this.classroomRubrics = []
            this.handleDelete(data)
        }
    });
  }
}
