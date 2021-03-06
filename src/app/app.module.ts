import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from '@/_helpers';

import { appRoutingModule } from '@/app.routing';
import { JwtInterceptor, ErrorInterceptor } from '@/_helpers';
import { AppComponent } from '@/app.component';
import { HomeComponent } from '@/home';
import { LoginComponent } from '@/login';
import { RegisterComponent } from '@/register';
import { AlertComponent } from '@/_components';
import { ForgotPasswordComponent } from './forgot-password';
import { ChangePasswordComponent } from '@/change-password';
import { ChatComponent } from '@/chat';
import { InformationComponent } from '@/information';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    appRoutingModule
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AlertComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    ChatComponent,
    InformationComponent,
    UsersComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // провайдеры, используемые для создания поддельного внутреннего интерфейса
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
