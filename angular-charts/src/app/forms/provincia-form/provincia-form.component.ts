import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { HttpService } from 'src/app/service/http.service';
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
    private service: AuthService,
    private _httpservice: HttpService
  ) {}
  listPaises: any;
  listProvincias: any;
  listProvinciasPais: any;
  apiPaises = environment.API_URL_PAISES;
  apiProvincia = environment.API_URL_PROVINCIAS;
  apiLocalidad = environment.API_URL_LOCALIDADES;
  apiArgentinaMunicipios = environment.API_URL_ARGENTINA_MUNICIPIOS;
  isOptional = true;
  provinciaForm!: FormGroup;
  nombre_pais!: string;
  id_provincia!: string;
  subscription!: Subscription;
  subscription2!: Subscription;

  ngOnInit(): void {
    this.provinciaForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
    });
    this.subscription = this.service.paisSelected.subscribe(
      (message) => (this.nombre_pais = message)
    );
    this.subscription = this.service.provinciaSelected.subscribe(
      (message) => (this.id_provincia = message)
    );

    this.subscription2 = this.service.listProvincias.subscribe(
      (message) => (this.listProvinciasPais = message)
    );
  }

  setProvincia(nombre: any) {
    console.log('set provincia nombre', nombre);
    this.service.changeMessage(nombre);
    this.service.provinciaSelectedSource.next(nombre);
    this.GetLocalidadesByProvincia();
  }

  GetLocalidadesByProvincia() {
    if (this.nombre_pais == 'Argentina') {
      this._httpservice
        .httpGet(
          this.apiArgentinaMunicipios +
            this.id_provincia +
            '&orden=nombre&max=2100'
        )
        .subscribe((res: any) => {
          console.log('pais form get municipios', res.municipios);
          this.service.streamLocalides_ProvinciaSelected(res.municipios);
        });
    } else {
      let body = {
        country: this.nombre_pais,
        state: this.id_provincia,
      };
      this._httpservice
        .httpPost(this.apiLocalidad, body)
        .subscribe((res: any) => {
          console.log('provincia form get localidades', res.body.data);

          this.service.streamLocalides_ProvinciaSelected(res.body.data);
        });
    }
  }
}
