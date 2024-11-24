import { Component, OnInit } from '@angular/core';
import {
  SocialUser,
  SocialAuthService,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.scss'],
})
export class AuthButtonComponent implements OnInit {
  user?: SocialUser;
  loggedIn = false;
  authService: AuthService;

  constructor(
    private socialAuthService: SocialAuthService,
    authService: AuthService
  ) {
    this.authService = authService;
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.authService.loginGOAuth2(user);
      this.loggedIn = user != null;
    });
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }
}
