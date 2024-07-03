import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { VariableModalComponent } from '../variable-form/variable.modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-linea-produccion-form',
  templateUrl: './linea-produccion-form.component.html',
  styleUrls: ['./linea-produccion-form.component.css'],
})
export class LineaProduccionFormComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    public dialog: MatDialog
  ) {}
  listPlantas: any;
  listLineas: any;
  id_empresa_planta!: string;
  id_linea!: string;
  apiPlanta = environment.API_URL_PLANTA;
  apiLinea = environment.API_URL_LINEA_PRODUCCION;
  apiMaquina = environment.API_URL_MAQUINA;
  isOptional = true;
  lineaForm!: FormGroup;
  subscription!: Subscription;

  ngOnInit(): void {
    this.GetAllPlantas();
    this.lineaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
      descripcion: this.builder.control('', Validators.required),
      identificador: this.builder.control('', Validators.required),
    });

    this.subscription = this.service.listLineas.subscribe(
      (message) => (this.listLineas = message)
    );
    this.subscription = this.service.plantaSelected.subscribe(
      (message) => (this.id_empresa_planta = message)
    );
  }

  GetAllPlantas() {
    this.service.getForm(this.apiPlanta).subscribe((res: any) => {
      console.log(res);
      this.listPlantas = res['datos'];
    });
  }
  GetAllLineas() {
    this.service.getForm(this.apiLinea).subscribe((res: any) => {
      console.log(res);
      this.listLineas = res['datos'];
    });
  }

  createLinea() {
    if (this.lineaForm.valid) {
      console.log(this.lineaForm.value);
      let body = {
        id_empresa_planta: this.id_empresa_planta,
        nombre: this.lineaForm.value.nombre,
        descripcion: this.lineaForm.value.descripcion,
        identificador: this.lineaForm.value.identificador,
      };
      this.service.postForm(this.apiLinea, body).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success(
              'Linea de produccion registrada corectamente',
              '',
              {
                toastClass: 'yourclass ngx-toastr',
                positionClass: 'toast-bottom-center',
              }
            );
            this.service
              .getForm(this.apiLinea + this.id_empresa_planta)
              .subscribe((res: any) => {
                this.listLineas = res;
              });
          }
        },
        error: (error: any) => {
          this.toastr.error(error);
          console.log(error);
        },
      });
    } else {
      this.toastr.warning('Por favor entre datos validos');
    }
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
          this.GetAllLineas();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  setLinea(id: any, nombre: any) {
    console.log('set linea', id, 'nombre', nombre);
    this.service.changeMessage(id);
    this.id_linea = id;
    this.service.lineaSelectedSource.next(id);
    this.GetMaquinaByLinea();
  }

  GetMaquinaByLinea() {
    this.service
      .getForm(this.apiMaquina + this.id_linea)
      .subscribe((res: any) => {
        console.log('linea get maquinas', res);
        this.service.streamMaquinas_LineaSelected(res);
      });
  }
  openDialog(variable_id: string): void {
    const dialogRef = this.dialog.open(VariableModalComponent, {
      data: {
        variable_id: variable_id,
        titulo: 'esta linea de produccion',
      },
    });
  }
}
