import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
  listPlantas: any;
  id_empresa!: string;
  id_localidad!: string;
  id_planta!: string;
  apiLocalidad = environment.API_URL_LOCALIDADES;
  apiEmpresas = environment.API_URL_EMPRESAS;
  apiPlanta = environment.API_URL_PLANTA;
  apiLinea = environment.API_URL_LINEA_PRODUCCION;
  isOptional = true;
  plantaForm!: FormGroup;
  subscription!: Subscription;

  ngOnInit(): void {
    this.GetAllEmpresas();
    this.plantaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
      calle: this.builder.control('', Validators.required),
      altura: this.builder.control('', Validators.required),
    });
    this.subscription = this.service.listPlantas.subscribe(
      (message) => (this.listPlantas = message)
    );
    this.subscription = this.service.empresaSelected.subscribe(
      (message) => (this.id_empresa = message)
    );
    this.subscription = this.service.localidadSelected.subscribe(
      (message) => (this.id_localidad = message)
    );
  }

  GetAllEmpresas() {
    this.service.getForm(this.apiEmpresas).subscribe((res: any) => {
      console.log(res);
      this.listEmpresas = res['datos'];
    });
  }
  GetAllPlantas() {
    this.service.getForm(this.apiPlanta).subscribe((res: any) => {
      console.log(res);
      this.listPlantas = res['datos'];
    });
  }

  createPlanta() {
    if (this.plantaForm.valid) {
      let body = {
        id_localidad: this.id_localidad,
        id_empresa: this.id_empresa,
        nombre: this.plantaForm.value.nombre,
        calle: this.plantaForm.value.calle,
        altura: this.plantaForm.value.altura,
      };
      console.log(this.plantaForm.value);
      this.service.postForm(this.apiPlanta, body).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error.message);
          } else {
            this.toastr.success('Planta registrada corectamente', '', {
              toastClass: 'yourclass ngx-toastr',
              positionClass: 'toast-bottom-center',
            });
            this.service
              .getForm(this.apiPlanta + this.id_empresa)
              .subscribe((res: any) => {
                this.listPlantas = res;
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
  borrarPlanta(id: string) {
    console.log(this.apiPlanta + id);
    this.service.deleteForm(this.apiPlanta, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Planta borrada correctamente');
          this.GetAllPlantas();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }
  setPlanta(id: any, nombre: any) {
    console.log('set planta', id, 'nombre', nombre);
    this.service.changeMessage(id);
    this.id_planta = id;
    this.service.plantaSelectedSource.next(id);
    this.GetLineaByPlanta();
  }

  GetLineaByPlanta() {
    this.service
      .getForm(this.apiLinea + this.id_planta)
      .subscribe((res: any) => {
        console.log('planta get lineas', res);
        this.service.streamLinea_PlantaSelected(res);
      });
  }
}
