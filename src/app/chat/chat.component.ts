import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService, ChatService, MessagesService } from '@/_services';
import { first } from 'rxjs/operators';
import {Message, Photo, User} from '@/_models';
import { ActivatedRoute } from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  currentUser: User;
  chatID: string;
  messagesData: any;
  currentPage = 1;
  itemsPerPage = 20;
  countNewMessages = 0;
  loaded = false;
  needScroll = true;
  idsForViewed: number[];

  sendMessageForm: FormGroup;

  messagesSubscription: Subscription;

  @ViewChild('messagesItems') private messagesItemsContainer: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private messageService: MessagesService
  ) {
    this.chatID = this.route.snapshot.params.chatID;
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.messagesData = this.loadCurrentChat();
    this.sendMessageForm = this.formBuilder.group({
      content: ['', Validators.required]
    });
    this.subscribeToMessages();
  }

  subscribeToMessages(): void {
    this.messagesSubscription = this.messageService.getMessage()
      .subscribe(message => {
        if ( message !== null && (
          (message.messageFrom === this.chatID && message.messageTo === this.authenticationService.currentUserValue.id)
          || (message.messageFrom === this.authenticationService.currentUserValue.id && message.messageTo === this.chatID)
        ) ) {
          message.messageDirection = message.messageFrom === this.chatID ? 'in' : 'out';
          this.messagesData.data.items.push(message);
          if (message.messageDirection === 'in') {
            this.idsForViewed = [message.id];
            this.setMessagesViewed();
          }
        }
      });
  }

  private loadCurrentChat(): void {
    this.chatService.getChat(this.chatID, this.currentPage, this.itemsPerPage, this.countNewMessages)
      .pipe(first())
      .subscribe((messagesData: any) => {
        for (const message of messagesData.data.items) {
          if (message.messageDirection === 'in' && message.isViewed === 0) {
            this.idsForViewed.push(message.id);
          }
        }
        if (this.messagesData === undefined) {
          this.messagesData = messagesData;
        } else {
          for (let i = (messagesData.data.items.length - 1); i >= 0; i--) {
            this.messagesData.data.items.unshift(messagesData.data.items[i]);
          }
        }
        this.loaded = true;
        this.setMessagesViewed();
      });
  }

  setMessagesViewed(): void {
    if (this.idsForViewed.length > 0) {
      this.chatService.setViewed(this.idsForViewed)
        .pipe(first())
        .subscribe(response => this.idsForViewed = []);
    }
  }

  createNewMessage(
    messageContent: string,
    messageType: string
  ): Message {
    const newMessage = new Message();
    newMessage.messageFrom = this.currentUser.id;
    newMessage.messageTo = this.chatID;
    newMessage.messageContent = messageContent;
    newMessage.messageType = messageType;
    return newMessage;
  }

  onSubmit(): void {
    const message = this.createNewMessage(this.sendMessageForm.controls.content.value, 'text');
    this.messageService.sendMessage(message);
    this.sendMessageForm.controls.content.setValue('');
  }

  imageUpload(event): void {
    const image = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('message-photo', image, image.name);

    this.chatService.uploadImage(uploadData)
      .pipe(first())
      .subscribe((userPhoto: Photo) => {
        const photoMessage = this.createNewMessage(userPhoto.url, 'image');
        this.messageService.sendMessage(photoMessage);
      });
  }

  onScroll(event): void {
    if (event.target.scrollTop < 300 && this.currentPage < this.messagesData.data.totalPages) {
      this.needScroll = false;
      this.currentPage++;
      this.loadCurrentChat();
    }
  }
}
