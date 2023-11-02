import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
  apiTrigger = environment.API_URL_TRIGGER;
  variableForm!: FormGroup;
  id_maquina: any;
  id_proceso: any;
  id_trigger: any;
  listProcesos: any;
  listMaquina: any;
  listTrigger: any;
  listaVariables: any;
  subscription!: Subscription;

  ngOnInit(): void {
    this.GetAllVariables();
    this.GetAllProcesos();
    this.GetAllMaquinas();
    this.GetAllTriggers();
    this.variableForm = this._formBuilder.group({
      nombre: this._formBuilder.control('', Validators.required),
      descripcion: this._formBuilder.control(''),
      trigger_valor: this._formBuilder.control(''),
    });
    this.subscription = this.service.maquinaSelected.subscribe(
      (message) => (this.id_maquina = message)
    );
    this.subscription = this.service.procesoSelected.subscribe(
      (message) => (this.id_proceso = message)
    );
    this.subscription = this.service.triggerSelected.subscribe(
      (message) => (this.id_trigger = message)
    );
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
  GetAllTriggers() {
    this.service.getForm(this.apiTrigger).subscribe((res: any) => {
      console.log(res);
      this.listTrigger = res;
    });
  }
  GetAllVariables() {
    this.service.getForm(this.apiVariables).subscribe((res: any) => {
      console.log(res);
      this.listaVariables = res;
    });
  }

  crearVariable() {
    if (this.variableForm.valid) {
      console.log(this.variableForm.value);
      let body = {
        id_maquina: this.id_maquina,
        id_proceso: this.id_proceso,
        id_trigger: this.id_trigger,
        nombre: this.variableForm.value.nombre,
        trigger_valor: this.variableForm.value.trigger_valor,
      };
      this.service.postForm(this.apiVariables, body).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Variable registrada correctamente');
            this.GetAllVariables();
          }
        },
        error: (error: any) => {
          this.toastr.error(error);
          console.log(error);
        },
      });
    } else {
      this.toastr.warning('Por favor ingrese datos validos');
    }
  }

  borrarVariable(id: string) {
    console.log(this.apiVariables + id);
    this.service.deleteForm(this.apiVariables, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Variable borrada correctamente');
          this.GetAllVariables();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
}
