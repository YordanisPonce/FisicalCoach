import { Component, OnInit } from '@angular/core';
import { EffortRecoveryService } from 'src/app/_services/effort-recovery.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { saveAs } from 'file-saver';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-effort-recovery-record',
  templateUrl: './effort-recovery-record.component.html',
  styleUrls: ['./effort-recovery-record.component.scss'],
})
export class EffortRecoveryRecordComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private effortRecoveryService: EffortRecoveryService,
    private translate: TranslateService,
    private appStateService: AppStateService,
    private msg: AlertsApiService,
    private location: Location
  ) {
    this.responsiveOptions = [
      {
        breakpoint: '1920px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1200px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '576px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  newQuestions: boolean;
  loadingItems: any = [1, 2, 3];
  recoveryPrograms: any;
  responsiveOptions: any;
  loading: boolean = false;
  urlImages = environment.images;
  programId: string;
  program: any;

  getTeamId() {
    return this.appStateService.getTeam().id;
  }

  deleteRecoveryProgram(playerId: string, programId: string) {
    this.loading = true;
    this.effortRecoveryService
      .deleteRecoveryProgram(playerId, programId)
      .subscribe(
        (res: any) => {
          this.msg.succes(res.message);
          this.loading = false;
          this.router.navigateByUrl('/club/effort-recovery');
        },
        ({ error }) => {
          this.msg.error(error);
        }
      );
  }

  editProgram(program: any) {
    this.programId = program.id;
    this.newQuestions = true;
    this.program = program;
  }

  getBatteryToolTip(status: string) {
    return this.translate.instant('effort_recovery')[status];
  }

  printRecoveryProgram(effortRecoveryId: string) {
    this.effortRecoveryService
      .getRecoveryProgramPdf(this.recoveryPrograms.player.id, effortRecoveryId)
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        saveAs(
          blob,
          `effort-recovery-${this.recoveryPrograms.player.full_name}.pdf`
        );
      });
  }

  printRecoveryPrograms(playerId: string) {
    this.effortRecoveryService
      .getAllRecoveryProgramsPdf(playerId)
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        saveAs(
          blob,
          `effort-recovery-${this.recoveryPrograms.player.full_name}.pdf`
        );
      });
  }

  getRecoveryPrograms() {
    const playerId = this.route.snapshot.paramMap.get('effortRecovery')!;

    this.effortRecoveryService
      .getEffortProgramsRecord(playerId, this.getTeamId())
      .subscribe(
        (data: any) => {
          this.recoveryPrograms = data.data;
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

  refreshListPrograms() {
    // this.loading = true;
    // this.effortRecoveryList = [];
    // this.getEffortRecoveryPrograms();
    this.getRecoveryPrograms();
  }

  ngOnInit(): void {
    this.getRecoveryPrograms();
  }
}
