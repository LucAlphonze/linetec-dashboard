import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-maquina-form',
  templateUrl: './maquina-form.component.html',
  styleUrls: ['./maquina-form.component.css'],
})
export class MaquinaFormComponent implements OnInit {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listLineas: any;
  listTipoMaquina: any;
  apiLinea = environment.API_URL_LINEA_PRODUCCION;
  apiTipoMaquina = environment.API_URL_TIPO_MAQUINA;
  apiMaquina = environment.API_URL_MAQUINA;
  isOptional = true;
  maquinaForm!: FormGroup;

  ngOnInit(): void {
    this.GetAllLineas();
    this.GetAllTipos();
    this.maquinaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
      marca: this.builder.control('', Validators.required),
      id_tipo_maquina: this.builder.control('', Validators.required),
      modelo: this.builder.control('', Validators.required),
      detalle: this.builder.control('', Validators.required),
      id_linea_produccion: this.builder.control('', Validators.required),
    });
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

  createMaquina() {
    if (this.maquinaForm.valid) {
      console.log(this.maquinaForm.value);
      this.service.postForm(this.apiMaquina, this.maquinaForm.value).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Maquina registrada corectamente');
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
