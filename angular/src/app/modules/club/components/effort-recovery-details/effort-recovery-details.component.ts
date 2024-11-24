import { Component, OnInit } from '@angular/core';
import { EffortRecoveryService } from 'src/app/_services/effort-recovery.service'
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-effort-recovery-details',
  templateUrl: './effort-recovery-details.component.html',
  styleUrls: ['./effort-recovery-details.component.scss']
})
export class EffortRecoveryDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private effortRecoveryService: EffortRecoveryService,
    private translate: TranslateService,
  ) { }

  playerProgramDetails:any
  urlImages = environment.images

  ngOnInit(): void {
    console.log(this.playerProgramDetails)

    const player = this.route.snapshot.paramMap.get('player')!;
    const recoveryProgram = this.route.snapshot.paramMap.get('effortRecovery')!;

    this.effortRecoveryService.getEffortProgramDetails(player,recoveryProgram).subscribe((data:any) => {
      console.log(data)
      this.playerProgramDetails = data.data
      console.log(this.playerProgramDetails)
    })

  }

  getBatteryToolTip(status:string){
    return this.translate.instant('effort_recovery')[status]
  }

}
