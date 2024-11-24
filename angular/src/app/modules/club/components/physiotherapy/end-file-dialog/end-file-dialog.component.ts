import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { Player } from 'src/app/_models/player';
import { PhysiotherapyService } from 'src/app/_services/fisiotherapy.service';

@Component({
  selector: 'app-end-file-dialog',
  templateUrl: './end-file-dialog.component.html',
  styleUrls: ['./end-file-dialog.component.scss'],
})
export class EndFileDialogComponent implements OnInit, OnDestroy {
  constructor(
    private appStateService: AppStateService,
    public msg: AlertsApiService,
    private physiotherapyService: PhysiotherapyService
  ) {}

  @Input() visible: boolean = false;
  @Input() player: Player[];
  @Output() closeFileDialog = new EventEmitter<boolean>();
  @Output() refreshPlayerList = new EventEmitter<boolean>();

  subscription$ = new Subscription();
  team: any;
  loading: boolean = false;

  closeDialog(): void {
    this.closeFileDialog.emit(true);
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();
  }

  /**
   * Finish file
   */
  finishFile(): void {
    this.loading = true;

    if (this.player[0].latest_file_fisiotherapy?.id) {
      this.subscription$ = this.physiotherapyService
        .updateFisiotherapyFile(
          this.team.id,
          this.player[0].id,
          this.player[0].latest_file_fisiotherapy?.id,
          { has_ended: true }
        )
        .subscribe(
          (res) => {
            console.log(res);

            if (res.success) {
              this.msg.succes('Ficha finalizada exitosamente');
              this.closeDialog();
              this.refreshPlayerList.emit(true);
            }

            this.loading = false;
          },
          (error) => {
            this.msg.error('Ha ocurrido un error al finalizar la ficha');
          }
        );
    }
  }

  ngOnDestroy(): void {
    if (this.subscription$) this.subscription$.unsubscribe();
  }
}
