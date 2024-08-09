import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { VariableModalComponent } from '../variable-form/variable.modal.component';

@Component({
  selector: 'app-maquina-form',
  templateUrl: './maquina-form.component.html',
  styleUrls: ['./maquina-form.component.css'],
})
export class MaquinaFormComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    public dialog: MatDialog
  ) {}
  listLineas: any;
  listTipoMaquina: any;
  listMaquinas: any;
  message: any;
  id_linea_produccion!: string;
  id_tipo_maquina!: string;
  apiLinea = environment.API_URL_LINEA_PRODUCCION;
  apiTipoMaquina = environment.API_URL_TIPO_MAQUINA;
  apiMaquina = environment.API_URL_MAQUINA;
  isOptional = true;
  maquinaForm!: FormGroup;
  subscription!: Subscription;

  ngOnInit(): void {
    this.GetAllLineas();
    this.GetAllTipos();

    this.maquinaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
      marca: this.builder.control('', Validators.required),
      modelo: this.builder.control('', Validators.required),
      detalle: this.builder.control('', Validators.required),
    });

    this.subscription = this.service.currentMessage.subscribe(
      (message) => (this.message = message)
    );
    this.subscription = this.service.listMaquinas.subscribe(
      (message) => (this.listMaquinas = message)
    );
    this.subscription = this.service.lineaSelected.subscribe(
      (message) => (this.id_linea_produccion = message)
    );
    this.subscription = this.service.tipoMaquinaSelected.subscribe(
      (message) => (this.id_tipo_maquina = message)
    );
  }

  GetAllLineas() {
    this.service.getForm(this.apiLinea).subscribe((res: any) => {
      console.log(res);
      this.listLineas = res['datos'];
    });
  }
  GetAllTipos() {
    this.service.getForm(this.apiTipoMaquina).subscribe((res: any) => {
      console.log(res);
      this.listTipoMaquina = res['datos'];
    });
  }
  GetAllMaquinas() {
    this.service.getForm(this.apiMaquina).subscribe((res: any) => {
      console.log(res);
      this.listMaquinas = res['datos'];
    });
  }

  createMaquina() {
    if (this.maquinaForm.valid) {
      console.log(this.maquinaForm.value);
      let body = {
        id_linea_produccion: this.id_linea_produccion,
        id_tipo_maquina: this.id_tipo_maquina,
        nombre: this.maquinaForm.value.nombre,
        marca: this.maquinaForm.value.marca,
        modelo: this.maquinaForm.value.modelo,
        detalle: this.maquinaForm.value.detalle,
      };
      this.service.postForm(this.apiMaquina, body).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Maquina registrada corectamente', '', {
              toastClass: 'yourclass ngx-toastr',
              positionClass: 'toast-bottom-center',
            });
            this.service
              .getForm(this.apiMaquina + this.id_linea_produccion)
              .subscribe((res: any) => {
                console.log('res maquina: ', res);
                this.listMaquinas = res;
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
  borrarMaquina(id: string) {
    console.log(this.apiMaquina + id);
    this.service.deleteForm(this.apiMaquina, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Maquina borrada correctamente');
          this.GetAllMaquinas();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  setMaquina(id: any, nombre: any) {
    console.log('set planta', id, 'nombre', nombre);
    this.service.changeMessage(id);
  }

  StreamMaquinaSelected(maquina_id: string) {
    this.service.streamMaquinaSelected(maquina_id);
  }
  openDialog(variable_id: string): void {
    const dialogRef = this.dialog.open(VariableModalComponent, {
      data: {
        variable_id: variable_id,
        titulo: 'esta maquina',
      },
    });
  }
}
