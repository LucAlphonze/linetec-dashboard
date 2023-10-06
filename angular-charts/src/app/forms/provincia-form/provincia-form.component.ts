import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-provincia-form',
  templateUrl: './provincia-form.component.html',
  styleUrls: ['./provincia-form.component.css'],
})
export class ProvinciaFormComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listPaises: any;
  listProvincias: any;
  listProvinciasPais: any;
  apiPaises = environment.API_URL_PAISES;
  apiProvincia = environment.API_URL_PROVINCIAS;
  apiLocalidad = environment.API_URL_LOCALIDADES;
  isOptional = true;
  provinciaForm!: FormGroup;
  id_pais!: string;
  id_provincia!: string;
  subscription!: Subscription;
  subscription2!: Subscription;

  ngOnInit(): void {
    this.GetAllPaises();
    this.provinciaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
    });
    this.subscription = this.service.paisSelected.subscribe(
      (message) => (this.id_pais = message)
    );
    this.subscription = this.service.provinciaSelected.subscribe(
      (message) => (this.id_provincia = message)
    );

    this.subscription2 = this.service.listProvincias.subscribe(
      (message) => (this.listProvinciasPais = message)
    );
  }

  GetAllPaises() {
    this.service.getForm(this.apiPaises).subscribe((res: any) => {
      console.log(res);
      this.listPaises = res['datos'];
    });
  }
  // no esta en uso
  GetAllProvincias() {
    this.service.getForm(this.apiProvincia).subscribe({
      next: (res: any) => {
        console.log(res);
        this.listProvincias = res['datos'];
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  createProvincia() {
    if (this.provinciaForm.valid) {
      console.log(this.provinciaForm.value);
      let body = {
        nombre: this.provinciaForm.value.nombre,
        id_pais: this.id_pais,
      };
      this.service.postForm(this.apiProvincia, body).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 200) {
            this.toastr.success('provincia registrada correctamente');
            this.service
              .getForm(this.apiProvincia + this.id_pais)
              .subscribe((res: any) => {
                this.listProvinciasPais = res;
              });
          } else if (res.status == 403) {
            this.toastr.warning('acceso denegado, token expirado');
          } else {
            this.toastr.warning(res.error.error);
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
  borrarProvincia(id: string) {
    console.log(this.apiProvincia + id);
    this.service.deleteForm(this.apiProvincia, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Provincia borrada correctamente');
          this.GetAllProvincias();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  setProvincia(id: any, nombre: any) {
    console.log('set provincia', id, 'nombre', nombre);
    this.service.changeMessage(id);
    this.service.provinciaSelectedSource.next(id);
    this.GetLocalidadesByProvincia();
  }

  GetLocalidadesByProvincia() {
    this.service
      .getForm(this.apiLocalidad + this.id_provincia)
      .subscribe((res: any) => {
        console.log('provincia form get localidades', res);

        this.service.streamLocalides_ProvinciaSelected(res);
      });
  }
}
