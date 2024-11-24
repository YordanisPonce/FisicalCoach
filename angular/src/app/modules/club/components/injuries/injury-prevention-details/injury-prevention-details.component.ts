import { Component, OnInit } from '@angular/core';
import { InjuryPreventionService } from 'src/app/_services/injury-prevention.service';
import { AppStateQuery } from 'src/app/stateManagement/appState.query';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-injury-prevention-details',
  templateUrl: './injury-prevention-details.component.html',
  styleUrls: ['./injury-prevention-details.component.scss'],
})
export class InjuryPreventionDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private injuryPreventionService: InjuryPreventionService,
    private appStateQuery: AppStateQuery,
    private appStateService: AppStateService,
    private msg: AlertsApiService,
    private location: Location
  ) {}

  strategyPrevention: boolean = false;
  evaluatingProgram: any = {};
  playerInjuryDetails: any;
  loading: boolean = false;
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

  printInjuryProgram(injuryItem: any) {
    this.injuryPreventionService
      .getInjuryPreventionPdf(
        this.appStateService.getTeam().id,
        injuryItem.player_id,
        injuryItem.id
      )
      .subscribe((res: any) => {
        // console.log(res)
        const blob = new Blob([res], { type: 'application/pdf' });
        // const fileUrl = URL.createObjectURL(blob);
        // window.open(fileUrl, '_blank');
        saveAs(blob, 'injury-prevention.pdf');
        // console.log(res)
      });
  }

  refreshPreventiveProgram() {
    const team = this.route.snapshot.paramMap.get('team')!;
    const player = this.route.snapshot.paramMap.get('player')!;
    const injuryPrevention =
      this.route.snapshot.paramMap.get('injuryPrevention')!;

    this.injuryPreventionService
      .getPlayerInjurieDetails(team, player, injuryPrevention)
      .subscribe(
        (data: any) => {
          console.log(data);
          this.playerInjuryDetails = data.data;
          if (!this.playerInjuryDetails.is_finished) {
            this.appStateQuery.team$.subscribe((res) => {
              this.evaluatingProgram.team_id = res.id;
            });
            this.evaluatingProgram.player_id =
              this.playerInjuryDetails.player_id;
            this.evaluatingProgram.injury_prevention_id =
              this.playerInjuryDetails.id;
          }
          console.log(this.playerInjuryDetails);
          this.loading = false;
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

  ngOnInit(): void {
    console.log(this.playerInjuryDetails);

    // const team = this.route.snapshot.paramMap.get('team')!;
    // const player = this.route.snapshot.paramMap.get('player')!;
    // const injuryPrevention = this.route.snapshot.paramMap.get('injuryPrevention')!;

    // this.injuryPreventionService.getPlayerInjurieDetails(team,player,injuryPrevention).subscribe((data:any) => {
    //   console.log(data)
    //   this.playerInjuryDetails = data.data
    //   this.evaluatingProgram = this.playerInjuryDetails.id
    //   console.log(this.playerInjuryDetails)
    // })
    this.loading = true;
    this.refreshPreventiveProgram();
  }
}
