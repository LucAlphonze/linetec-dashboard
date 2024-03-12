import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proceso-form',
  templateUrl: './proceso-form.component.html',
  styleUrls: ['./proceso-form.component.css'],
})
export class ProcesoFormComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}

  apiProceso = environment.API_URL_PROCESO;
  procesoForm!: FormGroup;
  listProceso: any;

  ngOnInit(): void {
    this.GetAllProcesos();
    this.procesoForm = this._formBuilder.group({
      nombre: this._formBuilder.control('', Validators.required),
      descripcion: this._formBuilder.control('', Validators.required),
    });
  }

  GetAllProcesos() {
    this.service.getForm(this.apiProceso).subscribe((res: any) => {
      console.log(res);
      this.listProceso = res['datos'];
    });
  }

  crearProceso() {
    if (this.procesoForm.valid) {
      console.log(this.procesoForm.value);
      this.service.postForm(this.apiProceso, this.procesoForm.value).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('proceso registrado correctamente', '', {
              toastClass: 'yourclass ngx-toastr',
              positionClass: 'toast-bottom-center',
            });
            this.GetAllProcesos();
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
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  setProceso(id: any, nombre: any) {
    console.log('set tipo', id, 'nombre', nombre);
    this.service.changeMessage(id);
  }

  StreamProcesoSelected(proceso_id: string) {
    this.service.streamProcesoSelected(proceso_id);
  }
}
