import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegistroFiltrado, Variable } from '../models/datos.model';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  registroGeneral = environment.API_URL_RGENERAL;
  variables = environment.API_URL_VARIABLES;
  private listaVariablesSource = new BehaviorSubject(<Variable[]>[]);
  private listaDatosSource = new BehaviorSubject(<RegistroFiltrado[]>[]);
  listaVariables = this.listaVariablesSource.asObservable();
  listaDatos = this.listaDatosSource.asObservable();

  constructor(private http: HttpClient) {}

  getValores(variable: string): Observable<any> {
    return this.http.get(this.registroGeneral + 'all/' + variable, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')?.toString(),
      },
    });
  }
  getValoresFiltrados(
    variable: String,
    inicio: String,
    fin: String,
    operacion: string
  ): Observable<any> {
    return this.http.get(
      this.registroGeneral + `filter/${variable}/${inicio}/${fin}/${operacion}`,
      {
        headers: {
          Authorization:
            'Bearer ' + sessionStorage.getItem('token')?.toString(),
        },
      }
    );
  }
  getVariables(): Observable<any> {
    return this.http.get(this.variables, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')?.toString(),
      },
    });
  }
  stream_Variables(variables: Variable[]) {
    console.log('stream variables: ', variables);
    this.listaVariablesSource.next(variables);
  }
  stream_Datos(datos: RegistroFiltrado[]) {
    console.log('stream datos: ', datos);
    this.listaDatosSource.next(datos);
  }
}
