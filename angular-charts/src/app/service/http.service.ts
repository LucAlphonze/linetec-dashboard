import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegistroFiltrado, Variable } from '../models/datos.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  registroGeneral = environment.API_URL_RGENERAL;
  variables = environment.API_URL_VARIABLES;
  private listaVariablesSource = new BehaviorSubject(<Variable[]>[]);
  private listaRegistroFiltradoSource = new BehaviorSubject(
    <RegistroFiltrado[]>[]
  );
  private listaRegistroFiltrado2Source = new BehaviorSubject(<[]>[]);
  private listaDatosSource3 = new BehaviorSubject(<[]>[]);
  private listaDatosInRangeSource = new BehaviorSubject(<[]>[]);
  listaVariables = this.listaVariablesSource.asObservable();
  listaRegistroFiltrado = this.listaRegistroFiltradoSource.asObservable();
  listaRegistroFiltrado2 = this.listaRegistroFiltrado2Source.asObservable();
  listaDatos3 = this.listaDatosSource3.asObservable();
  listaDatosInRange = this.listaDatosInRangeSource.asObservable();

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
  getValoresFiltrados2(
    variable: String,
    inicio: String,
    fin: String
  ): Observable<any> {
    return this.http.get(
      this.registroGeneral + `filter/${variable}/${inicio}/${fin}/`,
      {
        headers: {
          Authorization:
            'Bearer ' + sessionStorage.getItem('token')?.toString(),
        },
      }
    );
  }
  getAllInRange(
    variable: String,
    inicio: String,
    fin: String
  ): Observable<any> {
    return this.http.get(
      this.registroGeneral + `all/${variable}/${inicio}/${fin}/`,
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
  stream_RegistroFiltrado(datos: RegistroFiltrado[]) {
    console.log('stream registro filtrado: ', datos);
    this.listaRegistroFiltradoSource.next(datos);
  }
  stream_RegistroFiltrado2(datoGeneral: any) {
    this.listaRegistroFiltrado2Source.next(datoGeneral);
  }
  stream_Datos3(datoGeneral: any) {
    this.listaDatosSource3.next(datoGeneral);
  }
  stream_DatosInRange(datoGeneral: any) {
    this.listaDatosInRangeSource.next(datoGeneral);
  }
}
