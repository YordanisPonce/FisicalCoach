import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { PlayersService } from '../../../../_services/players.service';
import { Subscription } from 'rxjs';
import { AppStateQuery } from '../../../../stateManagement/appState.query';
import { environment } from 'src/environments/environment';
import HandleErrors from '../../../../utils/errors';
import { AlertsApiService } from '../../../../generals-services/alerts-api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-analyze-player-dialog',
  templateUrl: './analyze-player-dialog.component.html',
  styleUrls: ['./analyze-player-dialog.component.scss'],
})
export class AnalyzePlayerDialogComponent implements OnInit, OnDestroy {
  @Input() listSkill: any[] = [];
  @Input() listPuntuations: any[] = [];
  value: any;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<boolean>();
  subsPlayer: Subscription;
  options: any[] = [];
  player: any = {};
  saving = false;
  urlBase = environment.images;
  handleError = new HandleErrors(this.alertsApiService);

  constructor(
    private playerService: PlayersService,
    public alertsApiService: AlertsApiService,
    public translateService: TranslateService,
    private appStateQuery: AppStateQuery
  ) {}

  closeDialog(send: boolean) {
    this.close.emit(send);
  }

  ngOnInit(): void {
    this.subsPlayer = this.appStateQuery.player$.subscribe((res) => {
      const data = Object.assign({}, res);
      this.player = data;
    });
    this.listSkill.forEach((r) => {
      const item = Object.assign({}, r);
      item.puntuations = this.listPuntuations;
      item.puntuation = 0;
      this.options.push(item);
    });
  }

  ngOnDestroy() {
    if (this.subsPlayer) this.subsPlayer.unsubscribe();
  }

  validateDisabled() {
    const data = this.options.filter((x) => x.puntuation > 0);
    return data.length !== this.options.length;
  }

  saveAssessment() {
    const skill: any = [];
    this.options.forEach((x) => {
      const data = {
        punctuation_id: x.idPuntuation,
        skills_id: x.id,
      };
      skill.push(data);
    });
    const select = {
      skills: skill,
    };
    this.saving = true;
    this.playerService.addAssessment(select, this.player.id).subscribe(
      (r) => {
        this.saving = false;
        this.closeDialog(true);
        this.alertsApiService.succes(r.message);
      },
      (error) => {
        this.handleError.handleError(
          error,
          this.translateService.instant('PLAYERS.ACTUALIZACIONERROR')
        );
      }
    );
  }

  setPuntuations(option: any, puntuation: any) {
    const dataId = this.options.findIndex((x) => x.id === option.id);
    this.options[dataId].idPuntuation = puntuation.id;
  }
}
