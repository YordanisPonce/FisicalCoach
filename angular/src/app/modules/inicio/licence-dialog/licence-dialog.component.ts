import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { Licence, Package, User, UserSubscription } from 'src/app/_models/user';
import { UsersService } from 'src/app/_services/users.service';
import { AppStateService } from '../../../stateManagement/appState.service';

@Component({
  selector: 'app-licence-dialog',
  templateUrl: './licence-dialog.component.html',
  styleUrls: ['./licence-dialog.component.scss'],
})
export class LicenceDialogComponent implements OnInit, OnDestroy {
  @Input() visible: boolean = false;
  @Input() licences: Licence[] = [];
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() hide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshList: EventEmitter<boolean> = new EventEmitter<boolean>();

  subs$: Subscription;
  userPackage: Package[] = [];

  licenceList: { code: string; value: string; isValid: boolean }[] = [];
  role: string = '';
  userData: User;
  activesubscription: UserSubscription;
  loading: boolean = false;
  loadingInvitation: boolean = false;
  inputError: boolean = false;
  showAgain: boolean = false;

  constructor(
    private userService: UsersService,
    private msg: AlertsApiService,
    private appStateService: AppStateService
  ) {}

  ngOnInit(): void {
    this.userData = this.appStateService.getUserData();
    this.role = localStorage.getItem('role') as string;
    if (this.userData) {
      this.activesubscription = this.getUserInfo(this.userData);
    }

    this.licenceList = this.licences.map((licence) => ({
      code: licence.code,
      value: '',
      isValid: false,
    }));
  }

  /**
   * get user information
   * @param userData
   * @returns
   */
  getUserInfo(userData: User): UserSubscription {
    return userData.subscriptions.find(
      (subscription: any) => subscription.package_code === this.role
    );
  }

  inputChange(index: number): void {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const test = re.test(this.licenceList[index].value);
    this.licenceList[index].isValid = test;
  }

  /**
   * submit invitation
   * @param index
   */
  submit(index: number): void {
    this.loadingInvitation = true;
    const invitation = {
      code: this.licenceList[index].code,
      email: this.licenceList[index].value,
    };
    this.subs$ = this.userService.sendInvitation(invitation).subscribe(
      (res) => {
        this.loadingInvitation = false;
        this.msg.succes(res.message);
        this.refreshList.emit(true);

        this.licenceList = this.licenceList.map((item) => ({
          ...item,
          value: '',
        }));
      },
      ({ error }) => {
        this.msg.error(error);
        this.loadingInvitation = false;
        this.refreshList.emit(true);
      }
    );
  }

  /**
   * close dialog
   */
  close(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    localStorage.setItem('licenceDialog', JSON.stringify(!this.showAgain));
    this.hide.emit(false);
  }

  ngOnDestroy(): void {
    if (this.subs$) {
      this.subs$.unsubscribe();
    }
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.hide.emit(false);
  }
}
