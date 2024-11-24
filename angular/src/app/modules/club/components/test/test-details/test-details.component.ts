import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { Player } from 'src/app/_models/player';
import { PlayersService } from 'src/app/_services/players.service';
import { TestService } from 'src/app/_services/test.service';
import { TeamService } from 'src/app/_services/team.service';
import { Staff } from 'src/app/_models/team';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { PermissionMethods } from 'src/app/_directivas/user-permission.directive';
import { TranslateService } from '@ngx-translate/core';
import { testDetailsGeneralList } from 'src/app/utils/filterOptions';
import { TestType } from 'src/app/_models/test';
import { AlumnsService } from 'src/app/_services/alumns.service';

@Component({
  selector: 'app-test-details',
  templateUrl: './test-details.component.html',
  styleUrls: ['./test-details.component.scss'],
})
export class TestDetailsComponent implements OnInit, OnDestroy {
  subs = new Subscription();

  loadingTests: boolean = false;
  searchTest: string;
  detailList: any[] = [];
  testDetails: any[] = [];
  test: any;
  playerId: string | null;
  player: Player;
  isPsycologicalTest: boolean = false;
  staffs: Staff[] = [];
  team: ITeam;
  role: string = '';
  showPermission: PermissionMethods;
  selectedFilter: any;
  filterOptions: any[] | undefined;
  testTypeList: TestType[];

  constructor(
    private playerService: PlayersService,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private location: Location,
    private teamService: TeamService,
    private appStateService: AppStateService,
    private msg: AlertsApiService,
    private alumnService: AlumnsService
  ) {
    const state = this.router.getCurrentNavigation()?.extras?.state;
    if (state && state.isPsycologicalTest) {
      this.isPsycologicalTest = true;
    }
  }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') as string;
    this.team = this.appStateService.getTeam();
    this.playerId = this.route.snapshot.paramMap.get('id');
    if (!this.playerId) {
      this.playerId = this.appStateService.getPlayer().id;
    }

    if (this.role === 'sport') {
      this.getPlayerById(this.playerId as any);
    } else {
      this.getAlumnById(this.playerId as any);
    }
    this.getStaff();

    // this.translate.get('test').subscribe((res) => {
    // this.filterOptions = testDetailsGeneralList.map((item) => ({
    // ...item,
    // label: res[item.code],
    // children: item.children.map((child) => ({
    // ...child,
    // label: res[child.code],
    // })),
    // }));
    // });

    this.getTestTypes();
  }

  /**
   * get Player
   * @param id
   */
  getPlayerById(id: number) {
    this.subs = this.playerService.getPlayerById(id).subscribe(
      (res) => {
        this.player = res.data;
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
   * get Player
   * @param id
   */
  getAlumnById(id: string) {
    this.subs = this.alumnService
      .getAlumnDetails(id, this.appStateService.getClassroomAcademicYear())
      .subscribe(
        (res) => {
          this.player = {
            full_name: res?.data.alumn?.full_name,
            ...res.data,
          };
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
   * get test types
   */
  getTestTypes(): void {
    this.subs = this.testService.getTestTypeList('test').subscribe((res) => {
      this.filterOptions = res.data.map((item: any, i: number) => ({
        key: `${i}`,
        code: item.code,
        label: item.name,
        children: item.sub_types.map((subItem: any, j: number) => ({
          key: `${i}-${j + 1}`,
          subItem: subItem.code,
          label: subItem.name,
        })),
      }));
    });
  }

  /**
   * staff list by team
   */
  getStaff() {
    this.loadingTests = true;
    this.teamService.getStaffByTeam(this.team.id as any).subscribe((res) => {
      this.staffs = res.data;
      const userType = this.role === 'sport' ? 'player' : 'alumn';
      this.showTestsByplayer(this.playerId as unknown as number, userType);
    });
  }

  /**
   * get player tests
   * @param playerId
   * @param userType
   */
  showTestsByplayer(playerId: number, userType: string, params?: any): void {
    this.subs = this.testService
      .showTestsByUser(playerId, userType, this.team.id, params)
      .subscribe((res) => {
        this.detailList = res.data;
        this.testDetails = res.data;
        if (this.isPsycologicalTest) {
          this.detailList = this.detailList.filter(
            (detail) => detail.test.code === 'valoration_psychological'
          );
        }
        this.detailList = this.detailList.map((detail) => {
          const staff = this.staffs.find(
            (staff) => staff.id === detail.professional_directs_id
          );
          if (staff) {
            return {
              ...detail,
              staff_name: staff.full_name,
            };
          }
          return {
            ...detail,
            staff_name: 'N/A',
          };
        });
        this.loadingTests = false;
      });
  }

  /**
   * Filter Player
   * @param e Event
   */
  setValue(e: KeyboardEvent) {
    const filterTests = this.detailList?.filter((item: any) =>
      item.test.name?.toLowerCase().includes(this.searchTest)
    );
    if (this.searchTest.length > 0) {
      this.detailList = filterTests;
    } else {
      this.detailList = this.testDetails;
    }
  }

  /**
   * convert date application
   * @param date
   */
  convertApplicationDate(date: any): any {
    return moment(date).format('DD/MM/YYYY');
  }

  /**
   * back to details
   */
  back(): void {
    this.location.back();
  }

  /**
   * delete test
   */
  deleteTest(code: string): void {
    this.subs = this.testService.deleteTest(code).subscribe(
      (res) => {
        this.msg.succes(res.message);
        this.getStaff();
      },
      ({ error }) => {
        this.msg.error(error);
      }
    );
  }

  /**
   * handle filter
   */
  handleSelectFilter(cancel: boolean = false): void {
    const userType = this.role === 'sport' ? 'player' : 'alumn';
    this.loadingTests = true;

    if (cancel) {
      this.detailList = this.testDetails;
      this.selectedFilter = null;

      this.showTestsByplayer(this.playerId as unknown as number, userType);
      return;
    }

    let param = '';
    let paramValue = '';

    if (!this.selectedFilter.parent?.code) {
      param = 'test_type';
      paramValue = this.selectedFilter.code;
    } else {
      param = 'test_sub_type';
      paramValue = this.selectedFilter.subItem;
    }

    this.showTestsByplayer(this.playerId as unknown as number, userType, {
      type: param,
      value: paramValue,
    });
  }

  handlePermission(permission: PermissionMethods): void {
    this.showPermission = { ...this.showPermission, ...permission };
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
