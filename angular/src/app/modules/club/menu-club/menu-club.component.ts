import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Club } from '../../../_models/club';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { User, UserPermission } from 'src/app/_models/user';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';

@Component({
  selector: 'app-menu-club',
  templateUrl: './menu-club.component.html',
  styleUrls: ['./menu-club.component.scss'],
})
export class MenuClubComponent implements OnInit {
  sidebarVisible: boolean = true;
  currentRoute: string = '';

  constructor(
    private location: Location,
    public router: Router,
    private appStateService: AppStateService,
    private appStateQuery: AppStateQuery
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.path = val.url;
      }
    });
  }

  @Output()
  dismiss: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  closeSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  teamMenuList = [
    {
      name: 'home',
      route: 'home',
      icon: '/team/home.svg',
      permission: '',
    },
    {
      name: 'players',
      route: 'players',
      icon: '/team/player.svg',
      hr: true,
      permission: 'team_players_list',
    },
    {
      name: 'competitions',
      route: 'competitions',
      icon: '/team/competition.svg',
      permission: 'team_competition_list',
    },
    {
      name: 'scouting',
      route: 'scouting',
      icon: '/team/scouting.svg',
      hr: true,
      permission: 'team_scouting_list',
    },
    {
      name: 'workout',
      icon: '/team/exercise.svg',
      route: 'workout',
      permission: 'team_exercise_list',
    },
    {
      name: 'training-sessions',
      icon: '/team/session.svg',
      route: 'training-sessions',
      permission: 'team_session_exercise_list',
    },
    {
      name: 'test',
      icon: '/team/test.svg',
      route: 'test',
      permission: 'team_test_list',
    },
    {
      name: 'injury-prevention',
      icon: '/team/injury_prevention.svg',
      route: 'injury-prevention',
      permission: 'team_injury_prevention_list',
    },
    {
      name: 'rfd_injuries',
      icon: '/team/injury_rfd.svg',
      route: 'rfd-injuries',
      hr: true,
      permission: 'team_injury_rfd_list',
    },
    {
      name: 'physiotherapy',
      icon: '/team/fisiotherapy.svg',
      route: 'physiotherapy',
      hr: true,
      permission: 'team_fisiotherapy_list',
    },
    {
      name: 'effort-recovery',
      icon: '/team/effort_recovery.svg',
      route: 'effort-recovery',
      permission: 'team_effort_recovery_list',
    },
    {
      name: 'nutrition',
      icon: '/team/nutrition.svg',
      route: 'nutrition',
      hr: true,
      permission: 'team_nutrition_list',
    },
    {
      name: 'psychology',
      icon: '/team/psychology.svg',
      route: 'psychology',
      permission: 'team_psychology_list',
    },
  ];

  classMenuList = [
    {
      name: 'home_teacher',
      route: '/teacher/home',
      icon: '/teacher/class.svg',
      teacherPath: true,
    },
    {
      name: 'alumns',
      route: '/teacher/alumns',
      teacherPath: true,
      icon: '/teacher/alumn.svg',
    },
    {
      name: 'test',
      icon: '/teacher/test.svg',
      route: 'test',
    },
    {
      name: 'daily-check',
      icon: '/teacher/daily_control.svg',
      route: '/teacher/daily-check',
      teacherPath: true,
    },
    {
      name: 'evaluation',
      icon: '/teacher/evaluation.svg',
      route: '/teacher/evaluation',
      teacherPath: true,
    },
    {
      name: 'workout',
      icon: '/teacher/exercise.svg',
      route: 'workout',
    },
    {
      name: 'training-sessions',
      icon: '/teacher/session.svg',
      route: 'training-sessions',
    },
    {
      name: 'tutor',
      icon: '/teacher/tutorship.svg',
      route: '/teacher/tutor',
      teacherPath: true,
    },
    {
      name: 'calification',
      icon: '/teacher/qualification.svg',
      route: '/teacher/calification',
      teacherPath: true,
      hr: true,
    },
  ];
  path: string = '';
  subs: Subscription;
  club: Club;
  team: any;
  isAcademyPath: boolean = false;
  urlBase = environment.images;
  teamOptions: any[] = [];
  showPermission: PermissionMethods;
  user: User;

  role: any;

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    this.appStateQuery.team$.subscribe((res) => {
      this.team = res;
    });

    this.user = this.appStateService.getUserData();

    const filterTeamPermission = this.teamMenuList.filter((item) => {
      if (this.user.permissions.length === 0) return true;

      const findTeam = this.user.permissions.find(
        (permission) => permission.entity_id === this.team.id
      );

      if (!!findTeam) {
        return findTeam.lists.includes(item.permission) || item.name === 'home';
      }

      return false;
    });

    if (this.role !== 'teacher') {
      this.teamOptions = this.teamMenuList;
    } else {
      this.teamOptions = this.classMenuList;
    }

    this.path = this.location.path();

    if (this.location.path().includes('/academy')) {
      this.isAcademyPath = true;
    } else {
      this.isAcademyPath = false;
    }
  }

  clickItem() {
    this.dismiss.emit();
    this.closeSidebar.emit(false);
  }

  handlRedirectMenuOption(event: MouseEvent, option: any): void {
    this.dismiss.emit();
    this.closeSidebar.emit(false);

    if (event.button === 1) {
      window.open(
        option.teacherPath ? `/club/${option.route}` : option.route,
        '_blank'
      );

      return;
    }

    this.router.navigate(
      !option.teacherPath ? [`/club/${option.route}`] : [option.route]
    );
  }
}
