import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '@/_services';

/** в селекторе мы указываем тег, в который будут грузится наши сообщения.
 templateUrl -- путь к файлу шаблона этого компонента **/
@Component({ selector: 'alert', templateUrl: 'alert.component.html' })

export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void
  {
    this.subscription = this.alertService.getAlert()
      .subscribe(message => {
        // Проверяем, какой тип сообщения, и задаем ему CSS-классы
        switch (message && message.type) {
          case 'success':
            message.cssClass = 'alert alert-success';
            break;
          case 'error':
            message.cssClass = 'alert alert-danger';
            break;
        }

        this.message = message;
      });
  }

  ngOnDestroy(): void
  {
    this.subscription.unsubscribe();
  }
}
