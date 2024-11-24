import { Component, OnInit } from '@angular/core';
import { InjuryPreventionService } from 'src/app/_services/injury-prevention.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { saveAs } from 'file-saver';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-injury-prevention-record',
  templateUrl: './injury-prevention-record.component.html',
  styleUrls: ['./injury-prevention-record.component.scss'],
})
export class InjuryPreventionRecordComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private injuryPreventionService: InjuryPreventionService,
    private appStateService: AppStateService,
    private msg: AlertsApiService,
    private location: Location
  ) {}

  loadingItems: any = [1, 2, 3];
  injuryPrograms: any;
  loading: boolean = false;
  strategyPrevention: boolean = false;
  evaluatingProgram: any = {};
  teamId: string;
  playerId: string;
  images: string = environment.images;

  deleteInjuryProgram(injuryItem: any) {
    this.loading = true;
    // console.log(injuryItem)
    this.injuryPreventionService
      .deleteInjuryProgram(
        injuryItem.team_id,
        injuryItem.player_id,
        injuryItem.injury_prevention_id
      )
      .subscribe((data) => {
        console.log('programa eliminado con exito');
        this.loading = false;
        this.router.navigateByUrl('/club/injury-prevention');
      });
  }

  getProgramsRecord(teamId: string, playerId: string) {
    this.injuryPreventionService
      .getInjuryProgramsRecord(teamId, playerId)
      .subscribe(
        (data: any) => {
          this.injuryPrograms = data.data;
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

  evaluateProgram(program: any) {
    console.log(program);
    this.evaluatingProgram.injury_prevention_id = program.id;
    this.strategyPrevention = true;
  }

  deleteProgram(program: any) {
    this.loading = true;
    console.log(program);
    this.injuryPreventionService
      .deleteInjuryProgram(this.teamId, this.playerId, program.id)
      .subscribe((data) => {
        console.log('programa eliminado con exito');
        this.loading = false;
        this.router.navigateByUrl('/club/injury-prevention');
      });
  }

  printInjuryPrograms() {
    this.injuryPreventionService
      .getAllInjuriesPreventionPdf(
        this.appStateService.getTeam().id,
        this.evaluatingProgram.player_id
      )
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        saveAs(blob, 'injury-prevention.pdf');
      });
  }

  printInjuryProgram(injuryItem: any) {
    this.injuryPreventionService
      .getInjuryPreventionPdf(
        this.appStateService.getTeam().id,
        this.evaluatingProgram.player_id,
        injuryItem.id
      )
      .subscribe((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        saveAs(blob, 'injury-prevention.pdf');
      });
  }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('team')!;
    this.playerId = this.route.snapshot.paramMap.get('player')!;
    this.evaluatingProgram.team_id = this.teamId;
    this.evaluatingProgram.player_id = this.playerId;

    this.getProgramsRecord(this.teamId, this.playerId);
  }
}
