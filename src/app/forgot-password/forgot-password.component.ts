import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, AuthenticationService } from '@/_services';
import {first} from 'rxjs/operators';

@Component({
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent implements OnInit {
  restorePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  success = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.restorePasswordForm = this.formBuilder.group({
      email: ['', Validators.required]
    });

    // делаем URL для возврата - страницу логина
    this.returnUrl = '/login';
  }

  // удобный getter для простого доступа к полям формы
  // tslint:disable-next-line:typedef
  get f() { return this.restorePasswordForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // удаляем все оповещания из сервиса оповещаний
    this.alertService.clear();

    // перестаём входить, если форма невалидна
    if (this.restorePasswordForm.invalid) {
      return;
    }

    this.loading = true;
    // Логируем пользователя
    this.authenticationService.restorePassword(this.f.email.value)
      .pipe(first())
      .subscribe(
        data => {
          this.success = true;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

}
