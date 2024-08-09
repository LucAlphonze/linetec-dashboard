import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/app/service/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'variable-modal',
  templateUrl: 'variable-modal.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class VariableModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<VariableModalComponent>,
    private toastr: ToastrService,
    private service: AuthService,
    private httpService: HttpService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  subscription!: Subscription;
  listaVariables: any;

  apiVariables = environment.API_URL_VARIABLES;
  apiEmpresas = environment.API_URL_EMPRESAS;
  apiPlantas = environment.API_URL_PLANTA;
  apiLinea = environment.API_URL_LINEA_PRODUCCION;
  apiTipoMaquina = environment.API_URL_TIPO_MAQUINA;
  apiMaquina = environment.API_URL_MAQUINA;
  apiProceso = environment.API_URL_PROCESO;
  userUrl = environment.API_URL_USERS;

  id_localidad!: string;
  id_empresa!: string;
  id_planta!: string;
  id_linea!: string;
  id_tipoMaquina!: string;
  id_maquina!: string;
  id_preoceso!: string;

  ngOnInit(): void {
    this.subscription = this.service.localidadSelected.subscribe(
      (message) => (this.id_localidad = message)
    );
    this.subscription = this.service.empresaSelected.subscribe(
      (message) => (this.id_empresa = message)
    );
    this.subscription = this.service.plantaSelected.subscribe(
      (message) => (this.id_planta = message)
    );
    this.subscription = this.service.lineaSelected.subscribe(
      (message) => (this.id_linea = message)
    );
    this.subscription = this.service.tipoMaquinaSelected.subscribe(
      (message) => (this.id_tipoMaquina = message)
    );
    this.subscription = this.service.maquinaSelected.subscribe(
      (message) => (this.id_maquina = message)
    );
    this.subscription = this.service.procesoSelected.subscribe(
      (message) => (this.id_preoceso = message)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  switchDelete(id: any) {
    switch (this.data.titulo) {
      case 'esta empresa':
        this.borrarEmpresa(id);
        break;
      case 'esta planta':
        this.borrarPlanta(id);
        break;
      case 'esta linea de produccion':
        this.borrarLineaProduccion(id);
        break;
      case 'este tipo de maquina':
        this.borrarTipoMaquina(id);
        break;
      case 'esta maquina':
        this.borrarMaquina(id);
        break;
      case 'este proceso':
        this.borrarProcesos(id);
        break;
      case 'esta variable':
        this.borrarVariable(id);
        break;
      case 'este usuario':
        this.borrarUsuario(id);
        break;

      default:
        this.toastr.warning('Error desconocido');

        break;
    }
  }

  borrarVariable(id: string) {
    console.log(this.apiVariables + id);
    this.service.deleteForm(this.apiVariables, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Variable borrada correctamente', '', {
            toastClass: 'yourclass ngx-toastr',
            positionClass: 'toast-bottom-center',
          });
          this.GetAllVariables();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  borrarEmpresa(id: string) {
    this.service.deleteForm(this.apiEmpresas, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Empresa borrada correctamente');
          this.GetEmpresasByLocalidad();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  borrarPlanta(id: string) {
    console.log(this.apiPlantas + id);
    this.service.deleteForm(this.apiPlantas, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Planta borrada correctamente');
          this.GetPlantasByEmpresas();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  borrarLineaProduccion(id: string) {
    console.log(this.apiLinea + id);
    this.service.deleteForm(this.apiLinea, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Linea de produccion borrada correctamente');
          this.GetLineaByPlanta();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  borrarTipoMaquina(id: string) {
    console.log(this.apiTipoMaquina + id);
    this.service.deleteForm(this.apiTipoMaquina, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Tipo de maquina borrada correctamente');
          this.GetMaquinaByLinea();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  borrarMaquina(id: string) {
    console.log(this.apiMaquina + id);
    this.service.deleteForm(this.apiMaquina, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Maquina borrada correctamente');
          this.GetMaquinaByLinea();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  borrarProcesos(id: string) {
    console.log(this.apiProceso + id);
    this.service.deleteForm(this.apiProceso, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Proceso borrado correctamente');
          this.GetAllProcesos();
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  borrarUsuario(id: string) {
    this.service.deleteForm(this.userUrl, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Usuario borrado correctamente');
          this.service.GetAll().subscribe((res) => {
            this.service.streamUsers(res);
          });
        }
        this.dialogRef.close();
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  GetAllVariables() {
    this.service.getForm(this.apiVariables).subscribe((res: any) => {
      console.log(res);
      this.httpService.stream_Variables(res);
    });
  }
  GetEmpresasByLocalidad() {
    this.service
      .getForm(this.apiEmpresas + 'localidad/' + this.id_localidad)
      .subscribe((res: any) => {
        console.log('Localidad-form get empresas', res);
        this.service.streamEmpresas_LocalidadSelected(res);
      });
  }
  GetPlantasByEmpresas() {
    this.service
      .getForm(this.apiPlantas + this.id_empresa)
      .subscribe((res: any) => {
        console.log('empresa get plantas', res);
        this.service.streamPlantas_EmpresaSelected(res);
      });
  }
  GetLineaByPlanta() {
    this.service
      .getForm(this.apiLinea + this.id_planta)
      .subscribe((res: any) => {
        console.log('planta get lineas', res);
        this.service.streamLinea_PlantaSelected(res);
      });
  }
  GetMaquinaByLinea() {
    this.service
      .getForm(this.apiMaquina + this.id_linea)
      .subscribe((res: any) => {
        console.log('linea get maquinas', res);
        this.service.streamMaquinas_LineaSelected(res);
      });
  }
  GetAllProcesos() {
    this.service.getForm(this.apiProceso).subscribe((res: any) => {
      console.log(res);
      this.service.streamProcesos(res['datos']);
    });
  }
  GetAllTipoMaquinas() {
    this.service.getForm(this.apiTipoMaquina).subscribe((res: any) => {
      console.log(res);
      this.service.streamTipoMaquinas(res['datos']);
    });
  }
}
