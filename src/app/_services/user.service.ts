import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  // метод для регистрации пользователей. Передает модель User на API
  register(user: User) {
    return this.http.post(`/users/register`, user);
  }

  // метод для блокировки пользователей. Передает DELETE-запрос на API
  delete(id: number) {
    return this.http.delete(`/users/${id}`);
  }
}
