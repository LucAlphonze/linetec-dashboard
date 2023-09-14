import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  registroGeneral = environment.API_URL_RGENERAL;
  variables = environment.API_URL_VARIABLES;

  constructor(private http: HttpClient) {}

  getValores(variable: string): Observable<any> {
    return this.http.get(this.registroGeneral + 'all/' + variable, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')?.toString(),
      },
    });
  }
  getVariables(): Observable<any> {
    return this.http.get(this.variables, {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token')?.toString(),
      },
    });
  }
}
