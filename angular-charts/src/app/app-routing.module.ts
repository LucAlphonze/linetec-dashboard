import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarDatosComponent } from './components/listar-datos/listar-datos.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserlistingComponent } from './components/userlisting/userlisting.component';
import { authGuard } from './guard/auth.guard';
import { Home2Component } from './components/home2/home2.component';
import { Home3Component } from './components/home3/home3.component';
import { Home4Component } from './components/home4/home4.component';
import { Home5Component } from './components/home5/home5.component';

const routes: Routes = [
  { path: '', component: ListarDatosComponent, canActivate: [authGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'home2', component: Home2Component, canActivate: [authGuard] },
  { path: 'home3', component: Home3Component, canActivate: [authGuard] },
  { path: 'home4', component: Home4Component, canActivate: [authGuard] },
  { path: 'home5', component: Home5Component, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserlistingComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
