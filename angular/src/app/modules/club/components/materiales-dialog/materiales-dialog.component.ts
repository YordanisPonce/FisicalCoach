import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AppStateService } from 'src/app/stateManagement/appState.service';
import { ITeam } from 'src/app/_models/ITeam.interface';
import { ExerciseService } from 'src/app/_services/exercise.service';

@Component({
  selector: 'materiales-dialog',
  templateUrl: './materiales-dialog.component.html',
  styleUrls: ['./materiales-dialog.component.scss'],
})
export class MaterialesDialogComponent implements OnInit, OnDestroy {
  constructor(
    private exersiceService: ExerciseService,
    private appStateService: AppStateService
  ) {
    this.materials = [];
  }

  @Input() visible: boolean = false;
  @Input() sessionCode: string;
  @Output() close = new EventEmitter<boolean>();

  materials: { name: string; full_url: string; count: number; id: number }[];

  value: any;
  team: ITeam;
  loading: boolean = false;
  $subs = new Subscription();

  closeDialog() {
    // this.advancedDialog = false
    this.close.emit(false);
  }

  ngOnInit(): void {
    this.team = this.appStateService.getTeam();

    this.getSessionMaterials();
  }

  getSessionMaterials(): void {
    this.loading = true;
    this.$subs = this.exersiceService
      .getSessionMaterials(this.team.id, this.sessionCode)
      .subscribe((res) => {
        this.materials = res.data;
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    if (this.$subs) this.$subs.unsubscribe();
  }
}
