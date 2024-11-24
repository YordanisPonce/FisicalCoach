import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-lateral-actions',
  templateUrl: './lateral-actions.component.html',
  styleUrls: ['./lateral-actions.component.scss'],
})
export class LateralActionsComponent implements OnInit {
  @Input() matchInfo: any;
  @Input() position: string;
  @Input() sportCode: string;
  @Input() results: any;
  @Input() isFooterAction: boolean = false;
  @Input() isDisabled: boolean = false;

  @Output() sendAction: EventEmitter<any> = new EventEmitter<any>();

  scoreSports: string[] = [
    'football',
    'indoor_soccer',
    'waterpolo',
    'field_hockey',
    'roller_hockey',
    'ice_hockey',
    'handball',
  ];
  volleyballScore: string[] = ['volleyball', 'beach_volleyball'];
  sportsWithFault: string[] = ['indoor_soccer'];

  constructor() {}

  ngOnInit(): void {}

  /**
   * send action code selected
   * @param situation
   * @param actionSlug
   * @param actionRivalSlug
   * @param position
   */
  selectActionFromBoard(
    situation: string,
    actionSlug: string,
    actionRivalSlug: string,
    position: string
  ): void {
    let slug: string = '';

    if (position === 'local') {
      slug = situation === 'L' ? actionSlug : actionRivalSlug;
    } else {
      slug = situation === 'V' ? actionSlug : actionRivalSlug;
    }

    this.sendAction.emit({ situation: '', slug, position: '' });
  }

  /**
   * return sport action name
   */
  getSportActionName(
    situation: string,
    position: string,
    actionName: string,
    actionRivalName: string
  ): string {
    let name: string = 'scouting.customActions.';

    if (position === 'local') {
      name = `${name}${situation === 'L' ? actionName : actionRivalName}`;
    } else {
      name = `${name}${situation === 'V' ? actionName : actionRivalName}`;
    }

    return name;
  }

  /**
   * return sport faults
   */
  getFaults(
    situation: string,
    position: string,
    teamResult: number,
    rivalResult: number
  ): number {
    if (position === 'local') {
      return situation === 'L' ? teamResult : rivalResult;
    }

    return situation === 'V' ? teamResult : rivalResult;
  }

  /**
   * get fault by sport
   */
  faultCodeBySport(
    situation: string,
    position: string,
    teamFaultCode: string,
    rivalFaultCode: string
  ): string {
    if (this.sportCode === 'basketball') {
      if (position === 'local') {
        return situation === 'L' ? teamFaultCode : rivalFaultCode;
      }

      return situation === 'V' ? teamFaultCode : rivalFaultCode;
    }

    return '';
  }
}
