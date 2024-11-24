import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { GeneralService } from 'src/app/_services/general.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { SchoolService } from 'src/app/_services/school.service';
import { AlumnsService } from 'src/app/_services/alumns.service';

@Component( {
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: [ './information.component.scss' ]
} )
export class InformationComponent implements OnInit, OnDestroy {
  player: any = {};
  listCountries: any = [];
  listKinships: any = [];
  listLaterality: any = [];
  listGenders: any = [];
  listPositions: any = [];
  listSkill: any = [];
  listCourses: any = [];
  listSports: any = [];
  acneaeTypes: any = [];
  listGenderIdentity: any = [];
  listPuntuations: any = [];
  subscription: Subscription;
  role: 'teacher' | 'sport' = 'sport';
  
  constructor(
    private generalService: GeneralService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private schoolService: SchoolService,
    private alumnsService: AlumnsService
  ) {
  
  }
  
  ngOnInit(): void {
    this.loadList();
    this.getAcneaTypes();
    this.getCourses();
    this.getSports();
    this.getGenderIdentityList();
    this.role = localStorage.getItem( 'role' ) as 'sport' | 'teacher';
    if ( this.role === 'teacher' ) {
      this.subscription = this.alumnsService.alumn$.subscribe( ( res: any ) => {
        this.player = Object.assign( {}, res.alumn );
      } );
    }
    
    
    // this.subsPlayer = query.subscribe(res => {
    //   // console.log(res)
    //   const data = Object.assign({}, this.role==='teacher' ? res.alumn : res );
    //   // data.date_birth = new Date(res.date_birth);
    //   // data.gender = res.gender_id;
    //   // data.maximum_heart_rate = res.max_heart_rate;
    //   this.player = data;
    // });
  }
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
  
  getAcneaTypes() {
    this.generalService.getAcneaeTypes().subscribe( ( res: any ) => {
      this.acneaeTypes = res.data;
    } );
  }
  
  getCourses() {
    this.schoolService.getSubjectList( this.appStateService.getSchool().id ).subscribe( res => {
      this.listCourses = res.data;
    } );
  }
  
  getGenderIdentityList() {
    this.generalService.getGenderIdentity().subscribe( res => {
      this.listGenderIdentity = res.data;
    } );
  }
  
  getSports() {
    this.generalService.getListSport().subscribe( res => {
      this.listSports = res.data;
    } );
  }
  
  loadList() {
    this.appStateQuery.listCountry$.subscribe( data => {
      const r = Object.assign( [], data );
      this.listCountries = r;
    } );
    this.appStateQuery.listLaterality$.subscribe( data => {
      const r = Object.assign( [], data );
      this.listLaterality = r;
    } );
    this.appStateQuery.listPositions$.subscribe( data => {
      const r = Object.assign( [], data );
      this.listPositions = r;
    } );
    this.appStateQuery.listGender$.subscribe( data => {
      const r = Object.assign( [], data );
      this.listGenders = r;
    } );
    this.appStateQuery.listCivilStatus$.subscribe( data => {
      const r = Object.assign( [], data );
      this.listKinships = r;
    } );
    this.appStateQuery.listAnalizePlayer$.subscribe( r => {
      this.listPuntuations = r.listPuntuations;
      this.listSkill = r.listSkill;
    } );
  }
  
}
