import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-localidad-form',
  templateUrl: './localidad-form.component.html',
  styleUrls: ['./localidad-form.component.css'],
})
export class LocalidadFormComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listProvincias: any;
  listLocalidades: any;
  apiLocalidad = environment.API_URL_LOCALIDADES;
  apiProvincias = environment.API_URL_PROVINCIAS;
  apiEmpresas = environment.API_URL_EMPRESAS;
  isOptional = true;
  id_provincia!: string;
  id_localidad!: string;
  localidadForm!: FormGroup;
  subscription!: Subscription;
  subscription2!: Subscription;

  ngOnInit(): void {
    this.localidadForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
    });
    this.subscription = this.service.localidadSelected.subscribe(
      (message) => (this.id_localidad = message)
    );
    this.subscription = this.service.provinciaSelected.subscribe(
      (message) => (this.id_provincia = message)
    );
    this.subscription2 = this.service.listLocalidades.subscribe(
      (message) => (this.listLocalidades = message)
    );
  }
  //no esta en uso
  GetAllLocalidades() {
    this.service.getForm(this.apiLocalidad).subscribe((res: any) => {
      console.log(res);
      this.listLocalidades = res['datos'];
    });
  }

  createLocalidad() {
    if (this.localidadForm.valid) {
      console.log(this.localidadForm.value);
      let body = {
        nombre: this.localidadForm.value.nombre,
        id_provincia: this.id_provincia,
      };
      this.service.postForm(this.apiLocalidad, body).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Localidad registrada correctamente');
            this.service
              .getForm(this.apiLocalidad + this.id_provincia)
              .subscribe((res: any) => {
                this.listLocalidades = res;
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
  borrarLocalidad(id: string) {
    console.log(this.apiLocalidad + id);
    this.service.deleteForm(this.apiLocalidad, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Localidad borrada correctamente');
          this.GetAllLocalidades();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  setLocalidad(id: any) {
    console.log('set localidad', id);
    this.service.changeMessage(id);
    this.service.localidadSelectedSource.next(id);

    this.GetEmpresasByLocalidad();
  }

  GetEmpresasByLocalidad() {
    this.service
      .getForm(this.apiEmpresas + 'localidad/' + this.id_localidad)
      .subscribe((res: any) => {
        console.log('Localidad-form get empresas', res);
        this.service.streamEmpresas_LocalidadSelected(res);
      });
  }
}
