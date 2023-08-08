import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
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
  isOptional = true;
  paisForm!: FormGroup;

  ngOnInit(): void {
    this.GetAllPaises();
    this.paisForm = this._formBuilder.group({
      nombre: this._formBuilder.control('', Validators.required),
    });
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
