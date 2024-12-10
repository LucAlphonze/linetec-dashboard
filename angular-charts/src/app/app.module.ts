import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { LoginModalComponent } from './login-modal/login-modal.component';

import {
  DateAdapter,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DepartamentosComponent } from './forms/departamentos/departamentos.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ListarDatosComponentOld } from './components/listar-datos/listar-datos-old.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'yyyy-MM-dd', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'yyyy-MM-DD', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    DepartamentosComponent,
    ToolbarComponent,
    ListarDatosComponentOld,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatTooltipModule,
    MatNativeDateModule,

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
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
