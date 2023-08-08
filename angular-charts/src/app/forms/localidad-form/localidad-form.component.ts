import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  apiLocalidad = environment.API_URL_LOCALIDADES;
  apiProvincias = environment.API_URL_PROVINCIAS;
  isOptional = true;
  localidadForm!: FormGroup;

  ngOnInit(): void {
    this.GetAllProvincias();
    this.localidadForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
      id_provincia: this.builder.control('', Validators.required),
    });
  }

  GetAllProvincias() {
    this.service.getForm(this.apiProvincias).subscribe((res: any) => {
      console.log(res);
      this.listProvincias = res['datos'];
    });
  }
  createLocalidad() {
    if (this.localidadForm.valid) {
      console.log(this.localidadForm.value);
      this.service
        .postForm(this.apiLocalidad, this.localidadForm.value)
        .subscribe({
          next: (res: any) => {
            console.log('respuesta: ', res);
            if (res.status == 500) {
              this.toastr.warning(res.error.error);
            } else {
              this.toastr.success('Localidad registrada correctamente');
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
}
