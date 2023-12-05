import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarDatosComponent } from './components/listar-datos/listar-datos.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserlistingComponent } from './components/userlisting/userlisting.component';
import { authGuard } from './guard/auth.guard';

import { Home5Component } from './components/home5/home5.component';

const routes: Routes = [
  { path: '', component: ListarDatosComponent, canActivate: [authGuard] },
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
