import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '@/home';
import { LoginComponent } from '@/login';
import { RegisterComponent } from '@/register';
import { AuthGuard } from '@/_helpers';
import { ChangePasswordComponent } from '@/change-password';
import { ForgotPasswordComponent } from '@/forgot-password';
import { ChatComponent } from '@/chat';
import { InformationComponent } from '@/information';
import {UsersComponent} from '@/users';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // пустой url -- главная страница
  { path: 'login', component: LoginComponent }, // url login -- подгружаем компонент логина
  { path: 'register', component: RegisterComponent }, // url register -- подгружаем компонент регистрации
  { path: 'forgot-password', component: ForgotPasswordComponent }, // url forgot-password -- подгружаем компонент восстановления пароля
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard]},
  { path: 'chat/:chatID', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'user/:userID', component: InformationComponent, canActivate: [AuthGuard] },

  // все остальные пути -- отправляем на главную
  { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
