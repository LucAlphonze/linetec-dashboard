import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-linea-produccion-form',
  templateUrl: './linea-produccion-form.component.html',
  styleUrls: ['./linea-produccion-form.component.css'],
})
export class LineaProduccionFormComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listPlantas: any;
  apiPlanta = environment.API_URL_PLANTA;
  apiLinea = environment.API_URL_LINEA_PRODUCCION;
  isOptional = true;
  lineaForm!: FormGroup;

  ngOnInit(): void {
    this.GetAllPlantas();
    this.lineaForm = this.builder.group({
      descripcion: this.builder.control('', Validators.required),
      observaciones: this.builder.control('', Validators.required),
      id_empresa_planta: this.builder.control('', Validators.required),
      identificador: this.builder.control('', Validators.required),
    });
  }

  GetAllPlantas() {
    this.service.getForm(this.apiPlanta).subscribe((res: any) => {
      console.log(res);
      this.listPlantas = res['datos'];
    });
  }

  createLinea() {
    if (this.lineaForm.valid) {
      console.log(this.lineaForm.value);
      this.service.postForm(this.apiLinea, this.lineaForm.value).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Linea de produccion registrada corectamente');
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
