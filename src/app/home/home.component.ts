import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User, Message } from '@/_models';
import { UserService, AuthenticationService, ChatService, MessagesService } from '@/_services';
import { Subscription } from 'rxjs';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User;
  chats: any;
  currentPage = 1;
  itemsPerPage = 20;
  countNewMessages = 0;

  messagesSubscription: Subscription;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private chatService: ChatService,
    private messageService: MessagesService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit() {
    this.loadAllChats();
    this.messagesSubscription = this.messageService.getMessage()
      .subscribe((message: Message) => {
        if (this.chats){
          this.chats.forEach((element) => {
            console.log(element);
          });
        }
      });
  }

  deleteUser(id: number) {
    this.userService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadAllChats());
  }

  private loadAllChats() {
    this.chatService.getAll(this.currentPage, this.itemsPerPage, this.countNewMessages)
      .pipe(first())
      .subscribe(chats => this.chats = chats);
  }
}
