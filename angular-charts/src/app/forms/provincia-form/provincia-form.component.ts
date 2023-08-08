import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-provincia-form',
  templateUrl: './provincia-form.component.html',
  styleUrls: ['./provincia-form.component.css'],
})
export class ProvinciaFormComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listPaises: any;
  apiPaises = environment.API_URL_PAISES;
  apiProvincia = environment.API_URL_PROVINCIAS;
  isOptional = true;
  provinciaForm!: FormGroup;
  pais: any;

  ngOnInit(): void {
    this.GetAllPaises();
    this.provinciaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
      id_pais: this.builder.control('', Validators.required),
    });
  }

  GetAllPaises() {
    this.service.getForm(this.apiPaises).subscribe((res: any) => {
      console.log(res);
      this.listPaises = res['datos'];
    });
  }
  createProvincia() {
    if (this.provinciaForm.valid) {
      console.log(this.provinciaForm.value);
      this.service
        .postForm(this.apiProvincia, this.provinciaForm.value)
        .subscribe({
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
