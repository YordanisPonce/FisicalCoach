import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, ValidationErrors, ValidatorFn, } from '@angular/forms';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from 'src/app/login/services.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertsApiService } from 'src/app/generals-services/alerts-api.service';
import { MustMatch } from 'src/app/core/helpers/must-match.validator';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/_services/users.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  submit = false;
  token: any = '';
  recoverPasswordDialog: boolean = false;
  showPass: boolean = false;
  showConfirmPass: boolean = false;
  subs: Subscription;

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;

    return (pass === confirmPass) ? null : { notSame: true }
  }

  resetPassForm = new UntypedFormGroup({
    email: new UntypedFormControl('', Validators.required),
    password: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[!@#.$%^&*])[a-zA-Z0-9!@#.$%^&*]{8,16}$/)
    ]),
    confirmPassword: new UntypedFormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[0-9])(?=.*[!@#.$%^&*])[a-zA-Z0-9!@#.$%^&*]{8,16}$/)
    ]),
  }, {
    validators: this.checkPasswords
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private msg: AlertsApiService,
    private userService: UsersService
  ) {

  }

  get f() {
    return this.resetPassForm.controls;
  }

  ngOnInit(): void {

    this.token = this.route.snapshot.queryParamMap.get('token') as string;

    const isLogin = this.authenticationService.isLogin();
    if (isLogin)
    {
      this.router.navigate(['/inicio']);
      return;
    }
  }


  /**
   * submit data
   */
  sendData() {
    this.submit = true;

    if (this.resetPassForm.valid)
    {

      this.loading = true;

      const env = {
        email: this.resetPassForm.value.email.toLowerCase(),
        token: this.token,
        password: this.resetPassForm.value.password,
        password_confirmation: this.resetPassForm.value.confirmPassword
      };

      this.userService.resetPassword(env).subscribe(res => {

        this.msg.succes(res.message);
        this.loading = false;

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      }, ({ error }) => {
        this.msg.error(error);
        this.loading = false;
      })
    }
  }

  ngOnDestroy(): void {
    if (this.subs) this.subs.unsubscribe();
  }
}
