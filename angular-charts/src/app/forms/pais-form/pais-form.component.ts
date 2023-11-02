import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pais-form',
  templateUrl: './pais-form.component.html',
  styleUrls: ['./pais-form.component.css'],
})
export class PaisFormComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listPaises: any;
  apiPaises = environment.API_URL_PAISES;
  apiProvincia = environment.API_URL_PROVINCIAS;
  isOptional = true;
  paisForm!: FormGroup;
  id_pais!: string;
  message2!: any;
  subscription!: Subscription;
  subscription2!: Subscription;
  completed: boolean = false;

  ngOnInit(): void {
    this.GetAllPaises();
    this.paisForm = this._formBuilder.group({
      nombre: this._formBuilder.control('', Validators.required),
    });
    this.subscription = this.service.paisSelected.subscribe(
      (message) => (this.id_pais = message)
    );
  }
  urlPaises = environment.API_URL_PAISES;

  GetAllPaises() {
    this.service.getForm(this.apiPaises).subscribe((res: any) => {
      console.log(res);
      this.listPaises = res['datos'];
    });
  }
  createPais() {
    if (this.paisForm.valid) {
      console.log(this.paisForm.value);
      this.service.postForm(this.urlPaises, this.paisForm.value).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Pais registrado correctamente');
            this.GetAllPaises();
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
  borrarPais(id: string) {
    console.log(this.urlPaises + id);
    this.service.deleteForm(this.urlPaises, id).subscribe({
      next: (res: any) => {
        console.log('respuesta: ', res);
        if (res.status == 500) {
          this.toastr.warning(res.error.error);
        } else {
          this.toastr.success('Pais borrado correctamente');
          this.GetAllPaises();
        }
      },
      error: (error: any) => {
        this.toastr.error(error);
        console.log(error);
      },
    });
  }

  setPais(id: any, nombre: any) {
    console.log('set pais', id, 'nombre', nombre);
    this.service.changeMessage(id);
    this.service.paisSelectedSource.next(id);
    this.GetProvinciasByPais();
  }

  GetProvinciasByPais() {
    console.log('pais nombre', this.id_pais);

    this.service
      .getForm(this.apiProvincia + this.id_pais)
      .subscribe((res: any) => {
        console.log('pais form get provincias', res);
        this.service.streamProvincias_PaisSelected(res);
      });
  }
}
