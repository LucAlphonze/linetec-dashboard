import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Subscription,
  catchError,
  delay,
  Observable,
  BehaviorSubject,
  Subject,
  of,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../dialog.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}
  apiUrl = environment.API_URL_USERS;
  apiRole = environment.API_URL_ROLES;
  authToken: any;
  user: any;
  tokenSubscription = new Subscription();
  tokenSubscription2 = new Subscription();
  timeout?: any;

  private messageSource = new BehaviorSubject('default message');
  //observables que recogen la respuesta de la llamada a la api
  private provinciasSource = new BehaviorSubject('');
  private departamentosSource = new BehaviorSubject('');
  private localidadesSource = new BehaviorSubject('');
  private empresasSource = new BehaviorSubject('');
  private plantasSource = new BehaviorSubject('');
  private lineaSource = new BehaviorSubject('');
  private maquinaSource = new BehaviorSubject('');
  private fullnameSource = new BehaviorSubject('');

  //observables que recogen la opcion seleccionada
  paisSelectedSource = new BehaviorSubject('');
  provinciaSelectedSource = new BehaviorSubject('');
  departamentoSelectedSource = new BehaviorSubject('');
  localidadSelectedSource = new BehaviorSubject('');
  empresaSelectedSource = new BehaviorSubject('');
  plantaSelectedSource = new BehaviorSubject('');
  lineaSelectedSource = new BehaviorSubject('');
  tipoMaquinaSelectedSource = new BehaviorSubject('');
  maquinaSelectedSource = new BehaviorSubject('');
  procesoSelectedSource = new BehaviorSubject('');
  triggerSelectedSource = new BehaviorSubject('');

  currentMessage = this.messageSource.asObservable();

  // guardamos la respuesta en listas que son accesibles desde los componentes
  listProvincias = this.provinciasSource.asObservable();
  listDepartamentos = this.departamentosSource.asObservable();
  listLocalidades = this.localidadesSource.asObservable();
  listEmpresas = this.empresasSource.asObservable();
  listPlantas = this.plantasSource.asObservable();
  listLineas = this.lineaSource.asObservable();
  listMaquinas = this.maquinaSource.asObservable();

  // guardamos la opcion seleccionada para que sea accesible a los componentes
  paisSelected = this.paisSelectedSource.asObservable();
  provinciaSelected = this.provinciaSelectedSource.asObservable();
  departamentoSelected = this.departamentoSelectedSource.asObservable();
  localidadSelected = this.localidadSelectedSource.asObservable();
  empresaSelected = this.empresaSelectedSource.asObservable();
  plantaSelected = this.plantaSelectedSource.asObservable();
  lineaSelected = this.lineaSelectedSource.asObservable();
  tipoMaquinaSelected = this.tipoMaquinaSelectedSource.asObservable();
  maquinaSelected = this.maquinaSelectedSource.asObservable();
  procesoSelected = this.procesoSelectedSource.asObservable();
  triggerSelected = this.triggerSelectedSource.asObservable();
  fullname = this.fullnameSource.asObservable();

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  openDialog2(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      width: '571px',
      height: '292px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

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
    return this.http.post(this.apiUrl + 'login', body).pipe(
      catchError(async (error) => {
        console.log(error.message);
        return error;
      })
    );
  }
  storeUserData(token: any, user: any, rtoken: any) {
    console.log('storeUserData, user: ', user, 'token: ', token);
    this.timeout =
      this.jwtHelper.getTokenExpirationDate(token)!.valueOf() -
      new Date().valueOf();
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('rtoken', rtoken);
    sessionStorage.setItem('username', user.username);
    sessionStorage.setItem('fullname', user.name);
    sessionStorage.setItem('userrole', user.role.name);
    this.authToken = token;
    this.user = user;
    // this.expirationCounter(this.timeout);
    if (sessionStorage.getItem('userrole') == 'admin') {
      this.router.navigate(['home5']);
    } else {
      this.router.navigate(['']);
    }
  }

  expirationCounter(timeout: any) {
    console.log('timeout: ', timeout);
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null)
      .pipe(delay(timeout))
      .subscribe((expired) => {
        console.log('EXPIRED!!');
        this.dialog.closeAll();
        this.logout();
        this.toastr.error('sesion expirada', 'vuelva a iniciar sesion');
      });
    this.pre_expirationCounter(timeout);
  }

  pre_expirationCounter(timeout: any) {
    let timeNow = new Date();
    console.log('time now: ', timeNow);
    this.tokenSubscription2.unsubscribe();
    this.tokenSubscription2 = of(null)
      .pipe(delay(timeout - 120000))
      .subscribe(() => {
        this.openDialog();
        console.log('about to expire !!');
      });
  }
  logout() {
    this.tokenSubscription.unsubscribe();
    this.authToken = null;
    this.user = null;
    sessionStorage.clear();
    this.router.navigate(['/login']);
    sessionStorage.setItem('token', '');
    console.log(sessionStorage.getItem('token')?.toString());
  }

  IsLoggedIn() {
    return sessionStorage.getItem('username') != null;
  }
  getUserRole() {
    return sessionStorage.getItem('userrole') != null
      ? sessionStorage.getItem('userrole')?.toString()
      : '';
  }

  getUser() {
    try {
      var fullname = sessionStorage.getItem('fullname')!.toString();
      this.fullnameSource.next(fullname);
    } catch (error) {
      console.log('getUser error: ', error);
    }
  }

  // post
  Proceedregister(inputdata: any) {
    return this.http
      .post(this.apiUrl, inputdata, {
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
  UpdateUser(id: any, inputdata: any) {
    return this.http.post(this.apiUrl + '/' + id, inputdata);
  }

  // get formularios
  getForm(url: string) {
    return this.http
      .get(url, {
        headers: {
          Authorization:
            'Bearer ' + sessionStorage.getItem('token')?.toString(),
        },
      })
      .pipe(
        catchError(async (error) => {
          if (error.status == 403) {
            this.router.navigate(['/login']);
          }
          console.log(error.message);
          return error;
        })
      );
  }

  postForm(url: string, formData: any) {
    return this.http
      .post(url, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + sessionStorage.getItem('token')?.toString(),
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
  deleteForm(url: string, id: string) {
    return this.http
      .delete(url + 'delete/' + id, {
        headers: {
          Authorization:
            'Bearer ' + sessionStorage.getItem('token')?.toString(),
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

  changeMessage(message: string) {
    console.log('change message: ', message);
    this.messageSource.next(message);
  }
  streamProvincias_PaisSelected(provincias: string) {
    console.log('change message: ', provincias);
    this.provinciasSource.next(provincias);
  }

  streamDepartamentos_ProvinciaSelected(departamentos: string) {
    console.log('change message: ', departamentos);
    this.departamentosSource.next(departamentos);
  }
  streamLocalidades_DepartamentoSelected(localidades: string) {
    console.log('change message: ', localidades);
    this.localidadesSource.next(localidades);
  }

  streamEmpresas_LocalidadSelected(empresas: string) {
    console.log('change message: ', empresas);
    this.empresasSource.next(empresas);
  }
  streamPlantas_EmpresaSelected(plantas: string) {
    console.log('change message: ', plantas);
    this.plantasSource.next(plantas);
  }

  streamLinea_PlantaSelected(linea: string) {
    console.log('change message: ', linea);
    this.lineaSource.next(linea);
  }
  streamMaquinas_LineaSelected(Maquinas: string) {
    console.log('change message: ', Maquinas);
    this.maquinaSource.next(Maquinas);
  }
  streamTipoSelected(TipoMaquina: string) {
    console.log('tipo maquina selected: ', TipoMaquina);
    this.tipoMaquinaSelectedSource.next(TipoMaquina);
  }
  streamMaquinaSelected(Maquina: string) {
    console.log('maquina selected: ', Maquina);
    this.maquinaSelectedSource.next(Maquina);
  }
  streamProcesoSelected(proceso: string) {
    console.log('Proceso selected: ', proceso);
    this.procesoSelectedSource.next(proceso);
  }
  streamTriggerSelected(trigger: string) {
    console.log('Trigger selected: ', trigger);
    this.triggerSelectedSource.next(trigger);
  }
}
