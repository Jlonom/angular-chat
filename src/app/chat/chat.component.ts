import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthenticationService, ChatService, MessagesService } from '@/_services';
import { first } from 'rxjs/operators';
import {Message, User} from '@/_models';
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
          let newMessage = {
            message_direction: message.messageFrom === this.chatID ? 'out' : 'in',
            message_content: message.messageContent,
            message_type: message.messageType === 0 ? 'text' : 'image',
            created_at: message.createdAt
          };
          console.log(newMessage);
          console.log(this.messagesData);
          this.messagesData.data.items.push();
        }
      });
  }

  private loadCurrentChat(): void {
    this.chatService.getChat(this.chatID, this.currentPage, this.itemsPerPage, this.countNewMessages)
      .pipe(first())
      .subscribe(messagesData => { this.messagesData = messagesData; this.loaded = true; /*this.scrollToBottom();*/ });
  }

  onSubmit(): void {
    const messageToSent = new Message();
    messageToSent.messageContent = this.sendMessageForm.controls.content.value;
    messageToSent.messageFrom = this.currentUser.id;
    messageToSent.messageTo = this.chatID;
    messageToSent.messageType = 'text';
    this.messageService.sendMessage(messageToSent);
    this.sendMessageForm.controls.content.setValue('');
  }

  scrollToBottom(): void {
    if (typeof(this.messagesItemsContainer) !== 'undefined') {
      this.messagesItemsContainer.nativeElement.scrollTop = this.messagesItemsContainer.nativeElement.scrollHeight;
    }
  }

}
