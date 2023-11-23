import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './service/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpServiceService } from './service/http-service.service';
import { Subscription } from 'rxjs';
import { RegistroFiltrado, Variable } from './models/datos.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck, OnInit {
  opened: boolean = false;
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  title = 'angular-charts';
  isMenuRequired = false;
  isAdminUser = false;
  listVariables: Variable[] = [];
  subscription!: Subscription;
  listDatos: RegistroFiltrado[] = [];
  constructor(
    private router: Router,
    private service: AuthService,
    private _httpService: HttpServiceService
  ) {}

  ngOnInit(): void {
    this.subscription = this._httpService.listaVariables.subscribe(
      (message) => (this.listVariables = message)
    );
  }
  ngDoCheck(): void {
    let currentUrl = this.router.url;
    if (currentUrl == '/login' || currentUrl == '/register') {
      this.isMenuRequired = false;
      this.opened = false;
    } else {
      this.isMenuRequired = true;
    }
    if (this.service.getUserRole() === 'admin') {
      this.isAdminUser = true;
    } else {
      this.isAdminUser = false;
    }
  }
  logOut() {
    this.service.logout();
  }

  getFiltrados() {
    var inicio: any = this.range.value.start?.getTime().toString();
    var final: any = this.range.value.end?.getTime().toString();
    this._httpService
      .getValoresFiltrados(this.listVariables[1]._id, inicio, final, 'max')
      .subscribe((data) => {
        console.log(data);
        this._httpService.stream_Datos(data['datos']);
      });
    this._httpService
      .getValoresFiltrados2(this.listVariables[1]._id, inicio, final)
      .subscribe((data) => {
        console.log(data);
        this._httpService.stream_Datos2(data['datos']);
      });
    this._httpService
      .getValoresFiltrados2(this.listVariables[4]._id, inicio, final)
      .subscribe((data) => {
        console.log(data);
        this._httpService.stream_Datos3(data['datos']);
      });
    this.opened = false;
  }
}
