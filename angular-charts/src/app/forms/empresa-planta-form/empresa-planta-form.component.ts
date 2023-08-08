import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-empresa-planta-form',
  templateUrl: './empresa-planta-form.component.html',
  styleUrls: ['./empresa-planta-form.component.css'],
})
export class EmpresaPlantaFormComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listEmpresas: any;
  listLocalidades: any;
  apiLocalidad = environment.API_URL_LOCALIDADES;
  apiEmpresas = environment.API_URL_EMPRESAS;
  apiPlanta = environment.API_URL_PLANTA;
  isOptional = true;
  plantaForm!: FormGroup;

  ngOnInit(): void {
    this.GetAllLocalidades();
    this.GetAllEmpresas();
    this.plantaForm = this.builder.group({
      id_localidad: this.builder.control('', Validators.required),
      id_empresa: this.builder.control('', Validators.required),
      nombre: this.builder.control('', Validators.required),
      calle: this.builder.control('', Validators.required),
      altura: this.builder.control('', Validators.required),
    });
  }

  GetAllLocalidades() {
    this.service.getForm(this.apiLocalidad).subscribe((res: any) => {
      console.log(res);
      this.listLocalidades = res['datos'];
    });
  }

  GetAllEmpresas() {
    this.service.getForm(this.apiEmpresas).subscribe((res: any) => {
      console.log(res);
      this.listEmpresas = res['datos'];
    });
  }

  createPlanta() {
    if (this.plantaForm.valid) {
      console.log(this.plantaForm.value);
      this.service.postForm(this.apiPlanta, this.plantaForm.value).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Planta registrada corectamente');
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
