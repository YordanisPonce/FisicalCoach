import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IAccionesScoutingInterface } from 'src/app/_models/IAccionesScouting.interface';

@Component({
  selector: 'app-header-actions',
  templateUrl: './header-actions.component.html',
  styleUrls: ['./header-actions.component.scss'],
})
export class HeaderActionsComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() time: number;
  @Input() sportCode: any;
  @Input() actions: IAccionesScoutingInterface[] = [];
  @Output() storeActivity: EventEmitter<any> = new EventEmitter<any>();

  showChangePeriod = [
    'football',
    'indoor_soccer',
    'handball',
    'american_soccer',
    'roller_hockey',
    'field_hockey',
    'ice_hockey',
    'rugby',
    'waterpolo',
    'basketball'
  ];
  baseballBoard = ['baseball'];

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {}

  handleAction(slug: string): void {
    const action = this.actions.find((action) => action.code === slug);

    if (action) {
      this.storeActivity.emit({
        action_id: action.id,
        in_game_time: this.time,
        slug,
      });
    }
  }
}
