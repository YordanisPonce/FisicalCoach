import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SubPackage } from '../../../../_models/package';
import { UserSubscription } from '../../../../_models/user';
import { AppStateService } from '../../../../stateManagement/appState.service';

@Component({
  selector: 'app-confirm-update-subscription',
  templateUrl: './confirm-update-subscription.component.html',
  styleUrls: ['./confirm-update-subscription.component.scss'],
})
export class ConfirmUpdateSubscriptionComponent implements OnInit {
  @Input() currentSubscription: UserSubscription;
  @Input() newSubscription: SubPackage;
  @Input() display: boolean;
  @Input() intervalType: string = '';
  @Output() displayChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  clubs: any[] = [];
  displayCheckOut: boolean = false;

  constructor(private appStateService: AppStateService) {}

  get isCurrentGold() {
    return this.currentSubscription?.package_price?.subpackage?.code?.includes(
      'gold'
    );
  }

  get isCurrentSilver() {
    return this.currentSubscription?.package_price?.subpackage?.code?.includes(
      'silver'
    );
  }

  get isCurrentBronze() {
    return this.currentSubscription?.package_price?.subpackage?.code?.includes(
      'bronze'
    );
  }

  get isNewGold() {
    return this.newSubscription?.code?.includes('gold');
  }

  get isNewSilver() {
    return this.newSubscription?.code?.includes('silver');
  }

  get isNewBronze() {
    return this.newSubscription?.code?.includes('bronze');
  }

  /**
   * Valida si la subscripción actual es de mayor rango que la nueva
   */
  get showDetails() {
    this.displayCheckOut = true;
    if (this.isCurrentGold) {
      return true;
    } else {
      return this.isCurrentSilver && this.isNewBronze;
    }
  }

  ngOnInit(): void {
    this.clubs = this.appStateService.getClubs();
    this.validateDisplayCheckOut();
  }

  continueToCheckout() {
    this.displayCheckOut = true;
  }

  private validateDisplayCheckOut() {
    if (this.isCurrentGold) {
      this.displayCheckOut = false;
    } else {
      if (this.isCurrentSilver || this.isCurrentBronze) {
        this.displayCheckOut = true;
      }
    }
  }

  close() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}
