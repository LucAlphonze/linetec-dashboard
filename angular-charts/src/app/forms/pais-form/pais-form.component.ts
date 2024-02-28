import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { HttpService } from 'src/app/service/http.service';
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
    private service: AuthService,
    private _httpservice: HttpService
  ) {}
  listPaises: any;
  apiPaises = environment.API_URL_PAISES;
  apiArgentinaPronvincias = environment.API_URL_ARGENTINA_PROVINCIAS;
  apiProvincia = environment.API_URL_PROVINCIAS;
  isOptional = true;
  paisForm!: FormGroup;
  nombre_pais!: string;
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
      (message) => (this.nombre_pais = message)
    );
  }

  GetAllPaises() {
    this._httpservice.httpGet(this.apiPaises).subscribe((res: any) => {
      console.log('lista paises', res);
      this.listPaises = res['data'];
      this.setPais(this.listPaises[7].country);
    });
  }
  setPais(id: any) {
    console.log('set pais', id);
    this.service.changeMessage(id);
    this.service.paisSelectedSource.next(id);
    this.GetProvinciasByPais();
  }

  GetProvinciasByPais() {
    console.log('pais nombre', this.nombre_pais);
    if (this.nombre_pais == 'Argentina') {
      this._httpservice
        .httpGet(this.apiArgentinaPronvincias)
        .subscribe((res: any) => {
          console.log('pais form get provincias', res.provincias);
          this.service.streamProvincias_PaisSelected(res.provincias);
        });
    } else {
      let body = {
        country: this.nombre_pais,
      };
      this._httpservice
        .httpPost(this.apiProvincia, body)
        .subscribe((res: any) => {
          console.log('pais form get provincias', res.body.data.states);
          this.service.streamProvincias_PaisSelected(res.body.data.states);
        });
    }
  }
}
