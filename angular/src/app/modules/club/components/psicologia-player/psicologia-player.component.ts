import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TeamService } from 'src/app/_services/team.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Staff } from 'src/app/_models/team';
import { Player } from 'src/app/_models/player';
import { PsychologyService } from 'src/app/_services/psychology.service';
import { PlayerPsychology, PsychologyReport } from 'src/app/_models/psychology';
import { saveAs } from 'file-saver';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';

@Component({
  selector: 'app-psicologia-player',
  templateUrl: './psicologia-player.component.html',
  styleUrls: ['./psicologia-player.component.scss'],
})
export class PsicologiaPlayerComponent implements OnInit, OnDestroy {
  subsPlayer: Subscription;
  playerPsichology: PlayerPsychology;
  playerData: any;
  urlBase = environment.images;
  showEditTestDialog: boolean = false;
  team: ITeam;
  staff: Staff[] = [];
  selectedReport: PsychologyReport;
  reportId: number;
  loadingPDFS: boolean = false;
  loadingSinglePDF: boolean = false;
  loadingDelete: boolean = false;
  showDeleteDialog: boolean = false;

  constructor(
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private teamService: TeamService,
    private psychologyService: PsychologyService,
    private msg: AlertsApiService
  ) {}

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
    this.subsPlayer = this.appStateQuery.playerPsychology$.subscribe((r) => {
      this.playerPsichology = r;
      this.playerData = r;
    });
  }

  /**
   * filter report
   */
  filterReportById(reportId: number): void {
    this.selectedReport = this.playerPsichology.psychology_reports.find(
      (report) => report.id === reportId
    ) as PsychologyReport;
    this.showEditTestDialog = true;
  }

  validateFields(type: any) {
    const long = this.playerPsichology.psychology_reports.length;
    if (long === 0) {
      return 'Sin datos';
    }
  }

  ngOnDestroy(): void {
    if (this.subsPlayer) {
      this.subsPlayer.unsubscribe();
    }
  }

  /**
   *
   * @param id
   */
  deleteDialog(id: number): void {
    this.reportId = id;
    this.showDeleteDialog = true;
  }

  /**
   * download pfd reports
   */
  downloadAllReports(playerId: number): void {
    this.loadingPDFS = true;

    this.psychologyService.downloadReports(playerId).subscribe(
      (res: any) => {
        const blob = new Blob([res as any], { type: 'application/pdf' });
        saveAs(blob, `${this.playerData.full_name}-pyschologic-reports.pdf`);
        this.loadingPDFS = false;
      },
      ({ error }: any) => {
        this.msg.error(error);
        this.loadingPDFS = false;
      }
    );
  }

  /**
   * download pdf report by id
   */
  downloadPdfById(id: number): void {
    this.loadingSinglePDF = true;

    this.psychologyService.downloadReportById(id).subscribe(
      (res: any) => {
        const blob = new Blob([res as any], { type: 'application/pdf' });
        saveAs(blob, `${this.playerData.full_name}-pyschologic-report.pdf`);
        this.loadingSinglePDF = false;
      },
      ({ error }: any) => {
        this.msg.error(error);
        this.loadingSinglePDF = false;
      }
    );
  }

  /**
   * delete report
   */
  deleteReportById(reportid: number): void {
    this.loadingDelete = true;

    this.psychologyService.deleteReport(reportid).subscribe(
      (res) => {
        this.loadingDelete = false;
        this.showDeleteDialog = false;
        this.appStateService.updatePlayerPsychology$({
          isDelete: true,
          data: { id: reportid },
        });
        this.msg.succes(res.message);
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingDelete = false;
      }
    );
  }

  closeDialog(): void {
    this.showDeleteDialog = false;
  }
}
