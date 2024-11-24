import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { Club } from 'src/app/_models/club';

@Component( {
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: [ './sidebar-menu.component.scss' ]
} )
export class SidebarMenuComponent implements OnInit {
  
  currentRoute: string = '';
  @Output()
  dismiss: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  closeSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();
  classMenuList = [
    {
      name: 'home_teacher',
      route: '/teacher/home',
      icon: '/teacher/class.svg',
    },
    {
      name: 'alumns',
      route: '/teacher/alumns',
      icon: '/teacher/alumn.svg'
    },
    {
      name: 'test',
      icon: '/teacher/test.svg',
      route: '/teacher/test',
    },
    {
      name: 'daily-check',
      icon: '/teacher/daily_control.svg',
      route: '/teacher/daily-check',
    },
    {
      name: 'evaluation',
      icon: '/teacher/evaluation.svg',
      route: '/teacher/evaluation',
    },
    {
      name: 'workout',
      icon: '/teacher/exercise.svg',
      route: '/teacher/workout',
    },
    {
      name: 'training-sessions',
      icon: '/teacher/session.svg',
      route: '/teacher/training-sessions',
    },
    {
      name: 'tutor',
      icon: '/teacher/tutorship.svg',
      route: '/teacher/tutor',
    },
    {
      name: 'calification',
      icon: '/teacher/qualification.svg',
      route: '/teacher/calification',
      hr: true
    },
  ];
  path: string = '';
  subs: Subscription;
  club: Club;
  team: any;
  isAcademyPath: boolean = false;
  urlBase = environment.images;
  teamOptions: any[] = [];
  role: string | null;

  constructor( private appStateQuery: AppStateQuery,
               private location: Location,
               private translate: TranslateService,
               public router: Router
  ) {
    
    this.router.events.subscribe( val => {
      if ( val instanceof NavigationEnd ) {
        this.path = val.url;
      }
    } );
    
  }
  
  ngOnInit(): void {
    
    this.role = localStorage.getItem( 'role' );
    
    this.teamOptions = this.classMenuList;
    
    if ( this.role === 'teacher' ) {
      this.subs = this.appStateQuery.class$.subscribe( res => {
        this.team = res;
      } );
    } else {
      this.subs = this.appStateQuery.team$.subscribe( res => {
        this.team = res;
      } );
    }
    
    
    this.path = this.location.path();
    
    if ( this.location.path().includes( '/academy' ) ) {
      this.isAcademyPath = true;
    } else {
      this.isAcademyPath = false;
    }
  }
  
  
  clickItem() {
    this.dismiss.emit();
    this.closeSidebar.emit(false);
  }
  handlRedirectMenuOption(option: any): void {
    this.dismiss.emit();
    this.closeSidebar.emit(false);
    this.router.navigate(
      !option.teacherPath ? [`/teacher/${option.route}`] : [option.route]
    );
  }
}
