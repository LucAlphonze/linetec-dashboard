import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Import FusionCharts library and chart modules
import { ListarDatosComponent } from './components/listar-datos/listar-datos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { ToastrModule } from 'ngx-toastr';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UpdatepopupComponent } from './components/updatepopup/updatepopup.component';
import { UserlistingComponent } from './components/userlisting/userlisting.component';
import { PaisFormComponent } from './forms/pais-form/pais-form.component';
import { ProvinciaFormComponent } from './forms/provincia-form/provincia-form.component';
import { LocalidadFormComponent } from './forms/localidad-form/localidad-form.component';
import { EmpresaFormComponent } from './forms/empresa-form/empresa-form.component';
import { EmpresaPlantaFormComponent } from './forms/empresa-planta-form/empresa-planta-form.component';
import { MaquinaFormComponent } from './forms/maquina-form/maquina-form.component';
import { TipoMaquinaFormComponent } from './forms/tipo-maquina-form/tipo-maquina-form.component';
import { LineaProduccionFormComponent } from './forms/linea-produccion-form/linea-produccion-form.component';
import { ProcesoFormComponent } from './forms/proceso-form/proceso-form.component';
import { VariableFormComponent } from './forms/variable-form/variable-form.component';
import { JwtModule } from '@auth0/angular-jwt';
import { TriggerFormComponent } from './forms/trigger-form/trigger-form.component';
import { Home5Component } from './components/home5/home5.component';
import { TablaComponent } from './components/tabla/tabla.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InterceptorService } from './service/interceptor.service';
import { LoginModalComponent } from './login-modal/login-modal.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    ListarDatosComponent,
    RegisterComponent,
    LoginComponent,
    UpdatepopupComponent,
    UserlistingComponent,
    PaisFormComponent,
    ProvinciaFormComponent,
    LocalidadFormComponent,
    EmpresaFormComponent,
    EmpresaPlantaFormComponent,
    MaquinaFormComponent,
    TipoMaquinaFormComponent,
    LineaProduccionFormComponent,
    ProcesoFormComponent,
    VariableFormComponent,
    TriggerFormComponent,
    Home5Component,
    TablaComponent,
    LoginModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatTooltipModule,
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
