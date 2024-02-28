import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegistroFiltrado, Variable } from '../models/datos.model';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  registroGeneral = environment.API_URL_RGENERAL;
  variables = environment.API_URL_VARIABLES;
  // chartUrl = environment.API_URL_CHARTS;
  private listaVariablesSource = new BehaviorSubject(<Variable[]>[]);
  private listaRegistroFiltradoSource = new BehaviorSubject(
    <RegistroFiltrado[]>[]
  );
  private listaRegistroFiltrado2Source = new BehaviorSubject(<[]>[]);
  private listaDatosSource3 = new BehaviorSubject(<[]>[]);
  private listaDatosInRangeSource = new BehaviorSubject(<[]>[]);
  private listChartInfoSource = new Subject();
  private listCharDatatInfoSource = new Subject();
  private rangeSource = new Subject();

  listaVariables = this.listaVariablesSource.asObservable();
  listaRegistroFiltrado = this.listaRegistroFiltradoSource.asObservable();
  listaRegistroFiltrado2 = this.listaRegistroFiltrado2Source.asObservable();
  listaDatos3 = this.listaDatosSource3.asObservable();
  listaDatosInRange = this.listaDatosInRangeSource.asObservable();
  listChartInfo = this.listChartInfoSource.asObservable();
  listChartDataInfo = this.listCharDatatInfoSource.asObservable();
  rangeInfo = this.rangeSource.asObservable();
  inicio_str: string = '';
  final_str: string = '';

  constructor(private http: HttpClient) {}

  getValores(variable: string): Observable<any> {
    return this.http.get(this.registroGeneral + 'all/' + variable, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')?.toString(),
      },
    });
  }
  // getCharts(): Observable<any> {
  //   return this.http.get(this.chartUrl, {
  //     headers: {
  //       Authorization: 'Bearer ' + sessionStorage.getItem('token')?.toString(),
  //     },
  //   });
  // }
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
    inicio: String,
    fin: String,
    granularidad: string
  ): Observable<any> {
    return this.http.get(
      this.registroGeneral + `granularidad/${inicio}/${fin}/${granularidad}`,
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
  httpGet(url: string) {
    return this.http.get(url);
  }
  httpPost(url: string, body: any) {
    return this.http
      .post(url, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
      })
      .pipe(
        catchError(async (error) => {
          console.log(error.message);
          return error;
        })
      );
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
  stream_Chart_Info(chartInfo: any) {
    this.listChartInfoSource.next(chartInfo);
  }
  stream_ChartData_Info(chartDataInfo: any) {
    this.listCharDatatInfoSource.next(chartDataInfo);
  }
  set_Inicio_Final(inicio: string, final: string) {
    this.rangeSource.next([inicio, final]);
  }
  get_Inicio_Final() {
    return [this.inicio_str, this.final_str];
  }
}
