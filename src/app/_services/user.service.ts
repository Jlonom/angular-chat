import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

import { User } from '@/_models';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  // метод для регистрации пользователей. Передает модель User на API
  register(user: User): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/register`, user);
  }

  // метод для блокировки пользователей. Передает DELETE-запрос на API
  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }

  // метод для валидации токена
  validateRestoreToken(token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/restore-password/${token}`);
  }

  // метод, отправляющий запрос на замену пароля
  restorePassword(token: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/restore-password/${token}`, {password});
  }

  // метод, отправляющий запрос на информацию о пользователе
  getUserData(userID: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users/${userID}`);
  }

  updateUserData(userID: string, attribute: string, value: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/${userID}`, {attribute, value});
  }

  uploadUserPhoto(uploadData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/users/upload-photo`, uploadData);
  }

  getUserList(query = '', page = 1, limit = 20): Observable<any> {
    return this.http.get(`${environment.apiUrl}/users?query=${query}&page=${page}&limit=${limit}`);
  }
}
