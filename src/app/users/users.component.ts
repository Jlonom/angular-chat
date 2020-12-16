import {Component, OnInit} from '@angular/core';
import {UserService} from '@/_services';
import {first} from 'rxjs/operators';
import {User} from '@/_models';

@Component({
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  users: User[];
  page = 1;
  limit = 20;
  query = '';

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(refreshUserList = true): void {
    this.userService.getUserList(this.query, this.page, this.limit)
      .pipe(first())
      .subscribe((users: User[]) => {
        if (refreshUserList === false) {
          users.forEach(element => this.users.push(element));
        } else {
          this.users = users;
        }
      });
  }

  searchUsers(event: any): void {
    this.query = event.target.value;
    this.loadUsers();
  }

}
