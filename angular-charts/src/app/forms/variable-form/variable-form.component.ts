import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-variable-form',
  templateUrl: './variable-form.component.html',
  styleUrls: ['./variable-form.component.css'],
})
export class VariableFormComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}

  apiVariables = environment.API_URL_VARIABLES;
  apiProceso = environment.API_URL_PROCESO;
  apiMaquinas = environment.API_URL_MAQUINA;
  variableForm!: FormGroup;
  listProcesos: any;
  listMaquina: any;

  ngOnInit(): void {
    this.variableForm = this._formBuilder.group({
      nombre: this._formBuilder.control('', Validators.required),
      es_automatica: this._formBuilder.control('', Validators.required),
      id_maquina: this._formBuilder.control('', Validators.required),
      id_proceso: this._formBuilder.control('', Validators.required),
    });
  }

  GetAllProcesos() {
    this.service.getForm(this.apiProceso).subscribe((res: any) => {
      console.log(res);
      this.listProcesos = res['datos'];
    });
  }
  GetAllMaquinas() {
    this.service.getForm(this.apiMaquinas).subscribe((res: any) => {
      console.log(res);
      this.listMaquina = res['datos'];
    });
  }

  crearVariable() {
    if (this.variableForm.valid) {
      console.log(this.variableForm.value);
      this.service
        .postForm(this.apiVariables, this.variableForm.value)
        .subscribe({
          next: (res: any) => {
            console.log('respuesta: ', res);
            if (res.status == 500) {
              this.toastr.warning(res.error.error);
            } else {
              this.toastr.success('Variable registrada correctamente');
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
