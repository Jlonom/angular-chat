import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@/_models';
import { AlertService } from '@/_services/alert.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  private alertService: AlertService;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(email, password) {
    return this.http.post<any>(`/users/authenticate`, { email, password })
      .pipe(map(user => {
        // сохраняем пользователя внутри localStorage, что бы он оставался авторизированным даже при перезагрузке страниц
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

  restorePassword(email) {
    // Отправляем запрос на восстановление пароля. В случае успеха -- передаем alert-сообщение о том, что пользователь умничка
    return this.http.post<any>('/users/restore-password', { email })
      .pipe(map(response => {
        this.alertService.success(response.message);
      }));
  }

  logout() {
    // убираем текущего пользователя из localStorage, и ставим значение свойства currentUserSubject null
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
