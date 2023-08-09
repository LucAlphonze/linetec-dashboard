import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proceso-form',
  templateUrl: './proceso-form.component.html',
  styleUrls: ['./proceso-form.component.css'],
})
export class ProcesoFormComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listPaises: any;
  apiPaises = environment.API_URL_PAISES;
  isOptional = true;
  procesoForm!: FormGroup;

  ngOnInit(): void {
    this.procesoForm = this._formBuilder.group({
      descripcion: this._formBuilder.control('', Validators.required),
    });
  }
  urlPaises = environment.API_URL_PAISES;

  crearProceso() {
    if (this.procesoForm.valid) {
      console.log(this.procesoForm.value);
      this.service.postForm(this.urlPaises, this.procesoForm.value).subscribe({
        next: (res: any) => {
          console.log('respuesta: ', res);
          if (res.status == 500) {
            this.toastr.warning(res.error.error);
          } else {
            this.toastr.success('Pais registrado correctamente');
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
