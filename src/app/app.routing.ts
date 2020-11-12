import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from '@/home';
import { LoginComponent } from '@/login';
import { RegisterComponent } from '@/register';
import { AuthGuard } from '@/_helpers';
import { ForgotPasswordComponent } from '@/forgot-password';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, // пустой url -- главная страница
  { path: 'login', component: LoginComponent }, // url login -- подгружаем компонент логина
  { path: 'register', component: RegisterComponent }, // url register -- подгружаем компонент регистрации
  { path: 'forgot-password', component: ForgotPasswordComponent }, // url forgot-password -- подгружаем компонент восстановления пароля

  // все остальные пути -- отправляем на главную
  { path: '**', redirectTo: '' }
];

export const appRoutingModule = RouterModule.forRoot(routes);
