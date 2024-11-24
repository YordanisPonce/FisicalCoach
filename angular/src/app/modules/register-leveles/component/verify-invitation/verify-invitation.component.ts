import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ServicesService } from '../../services/services.service';
import { ComunicationComponentService } from 'src/app/_services/comunicationComponent.service';

@Component({
  selector: 'app-verify-invitation',
  templateUrl: './verify-invitation.component.html',
  styleUrls: ['./verify-invitation.component.scss'],
})
export class VerifyInvitationComponent implements OnInit, OnDestroy {
  subs$ = new Subscription();
  verifyAccount = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private subscriptionService: ServicesService,
    private comunicationComponentService: ComunicationComponentService
  ) {}

  ngOnInit(): void {
    this.close();
    const token = this.route.snapshot.paramMap.get('token');

    if (!token) {
      this.router.navigate(['/login']);
    }

    this.verifyInvitation(token as string);
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

  /**
   * verify invitation
   */
  verifyInvitation(token: string): void {
    this.subs$ = this.subscriptionService
      .handleLicenceInvitation(token as string)
      .subscribe(
        (res) => {
          const data = res.data;

          if (data.needs_registration) {
            this.router.navigate(['/register/form'], {
              state: { token: data.token },
            });

            localStorage.setItem('license_invite_token', data.token);
            localStorage.setItem('license_invite_email', data.email);
            localStorage.setItem('is_licence_invitation', 'true');
          } else {
            this.router.navigate(['/login']);
          }
        },
        ({ error }) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy(): void {
    if (this.subs$) this.subs$.unsubscribe();
  }
}
