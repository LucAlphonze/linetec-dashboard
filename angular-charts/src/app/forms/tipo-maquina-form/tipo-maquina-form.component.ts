import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
import { VariableModalComponent } from '../variable-form/variable.modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tipo-maquina-form',
  templateUrl: './tipo-maquina-form.component.html',
  styleUrls: ['./tipo-maquina-form.component.css'],
})
export class TipoMaquinaFormComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    public dialog: MatDialog
  ) {}
  listPaises: any;
  listTipoMaquina: any;
  apiTipoMaquina = environment.API_URL_TIPO_MAQUINA;
  isOptional = true;
  tipoMaquinaForm!: FormGroup;
  pais: any;
  subscription!: Subscription;

  ngOnInit(): void {
    this.GetAllTiposMaquina();
    this.subscription = this.service.listTipoMaquina.subscribe(
      (message) => (this.listTipoMaquina = message)
    );
    this.tipoMaquinaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
      descripcion: this.builder.control('', Validators.required),
    });
  }

  createTipoMaquina() {
    if (this.tipoMaquinaForm.valid) {
      console.log(this.tipoMaquinaForm.value);
      this.service
        .postForm(this.apiTipoMaquina, this.tipoMaquinaForm.value)
        .subscribe({
          next: (res: any) => {
            console.log('respuesta: ', res);
            if (res.status == 500) {
              this.toastr.warning(res.error.error);
            } else {
              this.toastr.success(
                'Tipo de maquina registrada correctamente',
                '',
                {
                  toastClass: 'yourclass ngx-toastr',
                  positionClass: 'toast-bottom-center',
                }
              );
              this.GetAllTiposMaquina();
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
  GetAllTiposMaquina() {
    this.service.getForm(this.apiTipoMaquina).subscribe((res: any) => {
      console.log('tipo maquinas: ', res);
      this.listTipoMaquina = res['datos'];
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
          this.GetAllTiposMaquina();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  setTipo(id: any, nombre: any) {
    console.log('set tipo', id, 'nombre', nombre);
    this.service.changeMessage(id);
  }

  StreamTipoSelected(tipo_id: string) {
    this.service.streamTipoSelected(tipo_id);
  }

  openDialog(variable_id: string): void {
    const dialogRef = this.dialog.open(VariableModalComponent, {
      data: {
        variable_id: variable_id,
        titulo: 'este tipo de maquina',
      },
    });
  }
}
