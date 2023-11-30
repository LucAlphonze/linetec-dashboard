import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

// Import FusionCharts library and chart modules
import { ListarDatosComponent } from './components/listar-datos/listar-datos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UpdatepopupComponent } from './components/updatepopup/updatepopup.component';
import { UserlistingComponent } from './components/userlisting/userlisting.component';
import { PaisFormComponent } from './forms/pais-form/pais-form.component';
import { ProvinciaFormComponent } from './forms/provincia-form/provincia-form.component';
import { LocalidadFormComponent } from './forms/localidad-form/localidad-form.component';
import { Home2Component } from './components/home2/home2.component';
import { EmpresaFormComponent } from './forms/empresa-form/empresa-form.component';
import { EmpresaPlantaFormComponent } from './forms/empresa-planta-form/empresa-planta-form.component';
import { MaquinaFormComponent } from './forms/maquina-form/maquina-form.component';
import { TipoMaquinaFormComponent } from './forms/tipo-maquina-form/tipo-maquina-form.component';
import { LineaProduccionFormComponent } from './forms/linea-produccion-form/linea-produccion-form.component';
import { Home3Component } from './components/home3/home3.component';
import { ProcesoFormComponent } from './forms/proceso-form/proceso-form.component';
import { Home4Component } from './components/home4/home4.component';
import { VariableFormComponent } from './forms/variable-form/variable-form.component';
import { JwtModule } from '@auth0/angular-jwt';
import { TriggerFormComponent } from './forms/trigger-form/trigger-form.component';
import { Home5Component } from './components/home5/home5.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TablaComponent } from './components/tabla/tabla.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    ListarDatosComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    UpdatepopupComponent,
    UserlistingComponent,
    PaisFormComponent,
    ProvinciaFormComponent,
    LocalidadFormComponent,
    Home2Component,
    EmpresaFormComponent,
    EmpresaPlantaFormComponent,
    MaquinaFormComponent,
    TipoMaquinaFormComponent,
    LineaProduccionFormComponent,
    Home3Component,
    ProcesoFormComponent,
    Home4Component,
    VariableFormComponent,
    TriggerFormComponent,
    Home5Component,
    TablaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost'],
      },
    }),
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastrModule.forRoot(),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
