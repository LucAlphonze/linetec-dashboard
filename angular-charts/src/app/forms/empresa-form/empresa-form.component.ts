import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empresa-form',
  templateUrl: './empresa-form.component.html',
  styleUrls: ['./empresa-form.component.css'],
})
export class EmpresaFormComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listLocalidades: any;
  apiLocalidad = environment.API_URL_LOCALIDADES;
  apiEmpresas = environment.API_URL_EMPRESAS;
  isOptional = true;
  empresaForm!: FormGroup;

  ngOnInit(): void {
    this.GetAllLocalidades();
    this.empresaForm = this.builder.group({
      id_localidad: this.builder.control('', Validators.required),
      razon_social: this.builder.control('', Validators.required),
      nombre_fantasia: this.builder.control('', Validators.required),
      calle: this.builder.control('', Validators.required),
      altura: this.builder.control('', Validators.required),
      piso: this.builder.control('', Validators.required),
      deptartamento: this.builder.control('', Validators.required),
      rubro: this.builder.control('', Validators.required),
    });
  }

  GetAllLocalidades() {
    this.service.getForm(this.apiLocalidad).subscribe((res: any) => {
      console.log(res);
      this.listLocalidades = res['datos'];
    });
  }

  createEmpresa() {
    if (this.empresaForm.valid) {
      console.log(this.empresaForm.value);
      this.service
        .postForm(this.apiEmpresas, this.empresaForm.value)
        .subscribe({
          next: (res: any) => {
            console.log('respuesta: ', res);
            if (res.status == 500) {
              this.toastr.warning(res.error.error);
            } else {
              this.toastr.success('Empresa registrada corectamente');
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
