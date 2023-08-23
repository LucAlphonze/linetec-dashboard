import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  apiUrl = environment.API_URL_USERS;
  apiRole = environment.API_URL_ROLES;
  // get

  GetAll() {
    return this.http.get(this.apiUrl);
  }

  //

  GetAllRoles() {
    return this.http.get(this.apiRole);
  }

  GetById(id: any) {
    return this.http.get(this.apiUrl + '/' + id);
  }

  LogIn(body: any) {
    return this.http.post(this.apiUrl + '/login', body).pipe(
      catchError(async (error) => {
        console.log(error.message);
        return error;
      })
    );
  }
  IsLoggedIn() {
    return sessionStorage.getItem('username') != null;
  }
  getUserRole() {
    return sessionStorage.getItem('userrole') != null
      ? sessionStorage.getItem('userrole')?.toString()
      : '';
  }
  // post
  Proceedregister(inputdata: any) {
    return this.http.post(this.apiUrl, inputdata);
  }
  UpdateUser(id: any, inputdata: any) {
    return this.http.post(this.apiUrl + '/' + id, inputdata);
  }

  // get formularios
  getForm(url: string) {
    return this.http.get(url).pipe(
      catchError(async (error) => {
        console.log(error.message);
        return error;
      })
    );
  }

  postForm(url: string, formData: any) {
    return this.http.post(url, formData).pipe(
      catchError(async (error) => {
        console.log(error.message);
        return error;
      })
    );
  }
}
