import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../../app.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubService } from '../../../_services/club.service';
import { AlertsApiService } from '../../../generals-services/alerts-api.service';
import { ComunicationComponentService } from 'src/app/_services/comunicationComponent.service';

@Component({
  selector: 'app-register-invitation',
  templateUrl: './register-invitation.component.html',
  styleUrls: ['./register-invitation.component.scss'],
})
export class RegisterInvitationComponent implements OnInit {
  dataUrl: any;
  loading: boolean = true;
  resp: any;

  constructor(
    private app: AppComponent,
    private router: Router,
    private alertsApiService: AlertsApiService,
    private activatedRoute: ActivatedRoute,
    private clubService: ClubService,
    private comunicationComponentService: ComunicationComponentService
  ) {}

  ngOnInit(): void {
    this.close();

    this.app.isLogin = false;
    const cachedItem = { ...localStorage };
    const listItems = Object.keys(cachedItem);
    listItems.forEach((item) => {
      if (
        item !== 'licenceDialog' &&
        item !== 'license_invite_token' &&
        item !== 'license_invite_email'
      ) {
        localStorage.removeItem(item);
      }
    });
    const action = this.activatedRoute.snapshot.queryParamMap.get('action');
    const token = this.activatedRoute.snapshot.paramMap.get('token');
    this.dataUrl = {
      action,
      token,
    };
    this.processInvitation();
  }

  close() {
    const cachedItem = { ...localStorage };
    const listItems = Object.keys(cachedItem);
    listItems.forEach((item) => {
      if (item !== 'licenceDialog') {
        localStorage.removeItem(item);
      }
    });
    this.comunicationComponentService.openNotifications(false);
    this.comunicationComponentService.login(false);
  }

  processInvitation() {
    this.clubService
      .invitation(this.dataUrl.token, this.dataUrl.action)
      .subscribe(
        (res: any) => {
          this.resp = res.data;
          this.loading = false;
          if (this.resp.code) {
            this.alertsApiService.succes(this.resp.message);
            localStorage.setItem('license_invite_token', this.resp?.code);
            localStorage.setItem('license_invite_email', this.resp?.email);
            this.navegate();
          } else {
            this.alertsApiService.error(this.resp.message);
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          }
        },
        (er) => {
          this.alertsApiService.error(er?.error?.message);
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        }
      );
  }

  navegate() {
    if (this.resp.needs_redirection) {
      this.router.navigate(['/register/form']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
