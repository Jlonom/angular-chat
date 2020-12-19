import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import {User, Message, Chat} from '@/_models';
import { UserService, AuthenticationService, ChatService, MessagesService } from '@/_services';
import { Subscription } from 'rxjs';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
  currentUser: User;
  chats: any;
  currentPage = 1;
  itemsPerPage = 20;
  canLoadMore = true;
  countNewMessages = 0;
  chatsType = 'all';

  messagesSubscription: Subscription;
  issetChat = false;
  issetChatIndex = null;
  isNeedUpdateUnreadCount = false;

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private chatService: ChatService,
    private messageService: MessagesService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.loadAllChats();
    this.messagesSubscription = this.messageService.getMessage()
      .subscribe((message: Message) => {
        let chatID = message.messageFrom;

        if (chatID === this.currentUser.id) {
          chatID = message.messageTo;
        } else {
          this.isNeedUpdateUnreadCount = true;
        }

        if (this.chats){
          for (let index = 0; index < this.chats.length; index++) {
            if (this.chats[index].chat_sender_id === chatID) {
              this.issetChat = true;
              this.issetChatIndex = index;
              break;
            }
          }
        }

        if (this.issetChat === true) {
          this.updateChatAndMoveUp(this.issetChatIndex);
        } else {
          this.loadChat(chatID);
        }
      });
  }

  updateChatAndMoveUp(index: number): void {
    const neededChat = this.chats.splice(index, 1);
    this.chats.unshift(neededChat);
    if (this.isNeedUpdateUnreadCount) {
      this.chats[0].unread++;
      this.isNeedUpdateUnreadCount = false;
    }
  }

  loadChat(chatID: string): void {
    this.chatService.getChatPreview(chatID)
      .pipe(first())
      .subscribe((chatPreview: Chat) => {
        this.chats.unshift(chatPreview);
        this.countNewMessages++;
      });
  }

  private loadAllChats(): void {
    this.chatService.getAll(this.chatsType, this.currentPage, this.itemsPerPage, this.countNewMessages)
      .pipe(first())
      .subscribe((chats: Chat[]) => {
        if (this.chats === undefined) {
          this.chats = chats;
        } else {
          for (const chat of chats) {
            this.chats.push(chat);
          }
        }
        if (chats.length < this.itemsPerPage) {
          this.canLoadMore = false;
        }
      });
  }

  changeChatsType(type: string): void {
    this.chatsType = type;
    this.currentPage = 1;
    this.countNewMessages = 0;
    this.loadAllChats();
  }

  onScroll(event): void {
    const leftSpace = event.target.scrollHeight - event.target.scrollTop;
    if (leftSpace < 1200 && this.canLoadMore) {
      this.currentPage++;
      this.loadAllChats();
    }
  }
}
