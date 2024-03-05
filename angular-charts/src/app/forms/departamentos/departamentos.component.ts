import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-departamentos',
  templateUrl: './departamentos.component.html',
  styleUrls: ['./departamentos.component.css'],
})
export class DepartamentosComponent {
  constructor(
    private builder: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService
  ) {}
  listProvincias: any;
  listDepartamentos: any;
  apiDepartamentos = environment.API_URL_ARGENTINA_DEPARTAMENTOS; //hay que cambiar la variable
  apiLocalidades = environment.API_URL_ARGENTINA_LOCALIDADES; //hay que cambiar la variable
  apiProvincias = environment.API_URL_PROVINCIAS;
  apiEmpresas = environment.API_URL_EMPRESAS;
  isOptional = true;
  id_provincia!: string;
  id_departamento!: string;
  departamentoForm!: FormGroup;
  subscription!: Subscription;
  subscription2!: Subscription;

  ngOnInit(): void {
    this.departamentoForm = this.builder.group({
      nombre: this.builder.control('', Validators.required),
    });
    this.subscription = this.service.departamentoSelected.subscribe(
      (message) => (this.id_departamento = message)
    );
    this.subscription = this.service.provinciaSelected.subscribe(
      (message) => (this.id_provincia = message)
    );
    this.subscription2 = this.service.listDepartamentos.subscribe(
      (message) => (this.listDepartamentos = message)
    );
  }
  //no esta en uso

  setDepartamento(id: any) {
    console.log('set Departamento', id);
    this.service.changeMessage(id);
    this.service.departamentoSelectedSource.next(id);

    this.GetLocalidadesByDepartamento();
  }

  GetLocalidadesByDepartamento() {
    this.service
      .getForm(
        this.apiLocalidades +
          this.id_provincia +
          `&departamento=${this.id_departamento}&orden=nombre&aplanar=true&campos=departamento.nombre&max=600&exacto=true`
      )
      .subscribe((res: any) => {
        console.log('Departamento-form get localidades', res.localidades);
        let localidadesUnicas = this.removeDuplicates(res.localidades);
        console.log('localidades unicas: ', localidadesUnicas);
        this.service.streamLocalidades_DepartamentoSelected(localidadesUnicas);
      });
  }
  removeDuplicates(data: any) {
    const seen = new Set();
    const filteredArr = data.filter((el: any) => {
      const duplicate = seen.has(el.nombre);
      seen.add(el.nombre);
      return !duplicate;
    });
    return filteredArr;
  }
}
// https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&departamento=${departamento}&aplanar=true&campos=basico&max=100&exacto=true
