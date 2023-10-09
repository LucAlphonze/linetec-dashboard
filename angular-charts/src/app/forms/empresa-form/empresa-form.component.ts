import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
  listEmpresas: any;
  apiLocalidad = environment.API_URL_LOCALIDADES;
  apiEmpresas = environment.API_URL_EMPRESAS;
  apiPlantas = environment.API_URL_PLANTA;
  isOptional = true;
  id_localidad!: string;
  id_empresa!: string;
  empresaForm!: FormGroup;
  subscription!: Subscription;

  ngOnInit(): void {
    this.GetAllLocalidades();
    this.empresaForm = this.builder.group({
      razon_social: this.builder.control('', Validators.required),
      nombre_fantasia: this.builder.control('', Validators.required),
      calle: this.builder.control('', Validators.required),
      altura: this.builder.control('', Validators.required),
      piso: this.builder.control('', Validators.required),
      deptartamento: this.builder.control('', Validators.required),
      rubro: this.builder.control('', Validators.required),
    });
    this.subscription = this.service.localidadSelected.subscribe(
      (message) => (this.id_localidad = message)
    );
    this.subscription = this.service.listEmpresas.subscribe(
      (message) => (this.listEmpresas = message)
    );
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

  createEmpresa() {
    if (this.empresaForm.valid) {
      console.log(this.empresaForm.value);
      let body = {
        id_localidad: this.id_localidad,
        razon_social: this.empresaForm.value.razon_social,
        nombre_fantasia: this.empresaForm.value.nombre_fantasia,
        calle: this.empresaForm.value.calle,
        altura: this.empresaForm.value.altura,
        piso: this.empresaForm.value.piso,
        deptartamento: this.empresaForm.value.deptartamento,
        rubro: this.empresaForm.value.rubro,
      };
      this.service.postForm(this.apiEmpresas, body).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Empresa registrada corectamente');
            this.service
              .getForm(this.apiEmpresas + 'localidad/' + this.id_localidad)
              .subscribe((res: any) => {
                console.log('empresas res after crear: ', res);
                this.listEmpresas = res;
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
  borrarEmpresa(id: string) {
    console.log(this.apiEmpresas + id);
    this.service.deleteForm(this.apiEmpresas, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Empresa borrada correctamente');
          this.GetAllEmpresas();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  setEmpresa(id: any, nombre: any) {
    console.log('set empresa', id, 'nombre', nombre);
    this.id_empresa = id;
    this.service.changeMessage(id);
    this.service.empresaSelectedSource.next(id);
    this.GetPlantasByEmpresas();
  }

  GetPlantasByEmpresas() {
    this.service
      .getForm(this.apiPlantas + this.id_empresa)
      .subscribe((res: any) => {
        console.log('empresa get plantas', res);
        this.service.streamPlantas_EmpresaSelected(res);
      });
  }
}
