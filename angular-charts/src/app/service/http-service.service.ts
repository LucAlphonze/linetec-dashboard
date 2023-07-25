import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpServiceService {
  url = 'http://localhost:3001/api/registro-general';
  constructor(private http: HttpClient) {}

  getValores(): Observable<any> {
    return this.http.get(this.url);
  }
}
